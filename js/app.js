
// TODO: Load data as json
function app(region, focus, locations, styles) {
      var styles;

    var initialLocations = locations, // Location data
        map, // Set map object scope
        selectedInfoWindow; // Set Google Maps info window object scope

    // Set Google Maps 'mapOptions' to region definded in app data object
    var Region = function(data) {
        this.mapOptions = {
            center: {lat: data.center.coord.lat, lng: data.center.coord.lng},
            zoom: data.zoom.initial,
            panControl: false,
            zoomControl: true,
            scrollwheel: false,
            scaleControl: false,
            liteMode: true,
            streetViewControl: false,
            overviewMapControl: false,
            overviewMapControlOptions: {opened: true},
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT,
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, 'map_style'],
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        };
    };

    // Location 'data' comes from the location object, active tag default is that all locations are visible
    var Location = function(data, activeTag) {
        this.name = data.name;
        this.marker = "";
        this.address = data.address;
        this.options = data.options;
        this.website = data.website || 'http://#';
        this.tag = data.tag;

        // Delete City and Country from Address for location search list
        var x = this.address.lastIndexOf(","),
            address = this.address.slice(0,x);

        // Create string for location search list
        this.title = ko.pureComputed(function() {
            return this.name + ", " + address + ", " + this.tag;
        }, this);

        this.focus = ko.computed(function() {

            for (var group in focus) {
                if (focus[group].indexOf(this.tag) >= 0) {
                    return group;
                }
            }
            return "";

        }, this);

        this.lat = data.coord.lat;
        this.lng = data.coord.lng;

        // If no tag is set to active all location items are visible, otherwise only locations with active tag are visible
        this.visible = ko.observable(!activeTag || activeTag === this.tag ? true : false);

        // Get Google Street View image
        this.img = ko.computed(function() {
            return 'https://maps.googleapis.com/maps/api/streetview?size=300x200&location=' +
                              this.lat +
                              ',' + this.lng;
        }, this);

        // FourSquare API
        this.fs_cat = "";
        this.fs_id = ko.observable("");
        this.fs_photos = ko.observableArray([]);
        this.fs_restaurants = ko.observableArray([]);
        this.fs_hotels = ko.observableArray([]);
        this.fs_tips = ko.observableArray([]);
    };

    // API request to Wikipedia
    var GetWikiLinks = function() {
        var self = this;

        self.links = ko.observableArray();

        self.getLinks = ko.computed(function() {

            var wikiRequestLinksTimeout = setTimeout(function() {
                    var $wikiElem = $('#wikipedia-links');
                    $wikiElem.text('Wikipedia Could Not Be Reached.');
                    console.log('Wikipedia Could Not Be Reached.');
                }, 5000);

            var wikiQuery = region.center.name,
            dt = 'jsonp',
            wikiBase = 'http://en.wikipedia.org/w/api.php',
            wikiUrl = wikiBase + '?action=opensearch&search=' + wikiQuery + '&format=json&callback=wikiCallback';

            $.ajax({
                    url: wikiUrl,
                    dataType: dt,
                    success: function(response){
                        var titleList = response[1],
                            definitionList = response[2];

                        for (var i = 0; i < titleList.length; i++) {
                            var titleStr = titleList[i],
                                urlStr = 'http://en.wikipedia.org/wiki/' + titleStr,
                                definitionStr = definitionList[i];
                            self.links.push({url: urlStr, title: titleStr, definition: definitionStr});
                        }
                    clearTimeout(wikiRequestLinksTimeout);
                }
            });
        });
    };

    // API request to Openweathermap
    var GetWeather = function() {
        var self = this;

        self.weatherStr = ko.observable("");

        var weather = 'http://api.openweathermap.org/data/2.5/weather?' +
                      'lat=' + region.center.coord.lat +
                      '&lon=' + region.center.coord.lng;

        $.getJSON(weather, function(response) {
            self.weatherStr(response.weather[0].description + "   " + Math.round(response.main.temp - 273.15) + " °C");
        })

        .done(function() { console.log('GetWeather request succeeded!'); })
        .fail(function(jqXHR, textStatus, errorThrown) {
            self.weatherStr('Open Weather Map Could Not Be Reached.');
            console.log('GetWeather request failed! ' + textStatus);
        })
        .always(function() { console.log('GetWeather request ended!'); });

    };

    // @CREDITS: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // App
    var MyViewModel = function() {

        var self = this;

        self.query = ko.observable(""); // Search box query string
        self.chosenLocationId = ko.observable(""); // Selected location item in locations item list

        self.chosenFocusId = ko.observable("");

        // TODO: Make map region changeable on click
        self.region = region.center.name.toUpperCase(); // Map region string for header app info
        self.distance = Math.round(getDistanceFromLatLonInKm(region.center.coord.lat, region.center.coord.lng, 37.362517, -122.03476)) +
                        ' km to Silicon Valley';

        // Sort location list by name property
        initialLocations.sort(function(left, right) {
            return left.name === right.name ? 0 : (left.name < right.name ? -1 : 1);
        });

        // Initialize Google Maps map markers
        self.myMap = ko.observableArray(ko.utils.arrayMap(initialLocations, function(locationItem) {
            return new Location(locationItem, "");
        }));

        self.currentLocation = ko.observable("");

        self.currentImage = ko.observable(0);

        // FourSquare Image Gallery Slider
        self.chosenDirectionId = function(data, event) {
          if (self.currentLocation().focus() === "POI") {
            var i = self.currentImage(),
                l = self.currentLocation().fs_photos().length,
                n = {'next': 1, 'prev': -1},
                d = n[event.target.id];
            i = i + d;
            if (i > l) { i = 0; }
            if (i < 0) { i = l; }
            self.currentImage(i);
          }
        };

        // Switch Google Street View on an off
        self.toggleStreetView = function(location, event) {
          if (self.currentLocation() === location) {
            google.maps.toggleStreetView(location);
          } else {
            google.maps.openStreetView(location);
          }
        };

        /**
         *
         * APIs start
         *
         */

        // Open Weather Map
        // Get current weather description and temperature from Open Weather Map API
        self.weather = new GetWeather().weatherStr; // Current weather string for header app info

        // Wikipedia
        // Get url and title for info link list about map region from Wikipedia API
        self.wikipediaLinks = new GetWikiLinks().links;

        // FourSquare
        // Get proper location categories from FourSquare API
        var CLIENT_ID = 'VWJWF5S1DZEW1CM3LXB1XNAYWYACBNCFDC35CYSJQ4MF5NNZ',
            CLIENT_SECRET = 'HE4ERXKDWNRP1VCF5FGJTTBMACM3WBEC03KTMKX0DAN5CXOH',
            version = 20150705;

        self.myMap().forEach(function(location,i) {

            var latlng = [location.lat, location.lng],
                query = location.name;

            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/search',
                dataType: 'json',
                data: 'limit=1' +
                      '&ll=' + latlng +
                      '&query=' + query +
                      '&client_id=' + CLIENT_ID +
                      '&client_secret=' + CLIENT_SECRET +
                      '&v=' + version +
                      '&m=foursquare',
                async: true,

                success: function(data) {
                    var response = data.response ? data.response : "";
                    var venue = data.response.hasOwnProperty("venues") ? data.response.venues[0] : "";
                    var category = venue && venue.hasOwnProperty("categories") ? venue.categories[0].name : "";
                    var id = venue ? venue.id : "";
                    self.myMap()[i].fs_cat = category;
                    self.myMap()[i].fs_id(id);
                }
            });
        });

        // Get POI photos from FourSquare API
        self.fsPhotos = ko.computed(function() {
            self.myMap().forEach(function(location) {
                if (location.focus() === "POI" && location.fs_id()) {
                    var VENUE_ID = location.fs_id();

                    $.ajax({
                        url: 'https://api.foursquare.com/v2/venues/'+ VENUE_ID +'/photos',
                        dataType: 'json',
                        data: '&client_id=' + CLIENT_ID +
                              '&client_secret=' + CLIENT_SECRET +
                              '&v=' + version +
                              '&m=foursquare',
                        async: true,

                        success: function(data) {
                            var response = data.response ? data.response : "";
                            var photos = response.hasOwnProperty("photos") ? data.response.photos.items : "";

                            photos.forEach(function(photo,i) {
                                var img = photo.prefix + 'width' + photo.width + photo.suffix;
                                if (location.fs_photos[i] != img);
                                location.fs_photos.push(img);
                            });
                        }
                    });
                }
            });
        });

        // Get POI nearby restaurants from FourSquare API
        self.fsNearByRestaurants = ko.computed(function() {
            self.myMap().forEach(function(location) {
                if (location.focus() === "POI") {
                    var latlng = [location.lat, location.lng],
                        query = "food";

                    $.ajax({
                        url: 'https://api.foursquare.com/v2/venues/explore',
                        dataType: 'json',
                        data: '&limit=10' +
                              '&ll=' + latlng +
                              '&radius=250'+
                              '&query=' + query +
                              '&sortByDistance=1' +
                              '&client_id=' + CLIENT_ID +
                              '&client_secret=' + CLIENT_SECRET +
                              '&v=' + version +
                              '&m=foursquare',
                        async: true,

                        success: function(data) {
                            var response = data.response ? data.response : "",
                                groups = response.groups ? response.groups : "",
                                items = groups[0].items ? groups[0].items : "";

                            items.forEach(function(item) {
                                location.fs_restaurants.push(item.venue.name);
                            });
                        }
                    });
                }
            });
        });

        // Get POI nearby hotels from FourSquare API
        self.fsNearByHotels = ko.computed(function() {
            self.myMap().forEach(function(location,i) {
                if (location.focus() === "POI") {
                    var latlng = [location.lat, location.lng],
                        query = "hotel";

                    $.ajax({
                        url: 'https://api.foursquare.com/v2/venues/explore',
                        dataType: 'json',
                        data: '&limit=10' +
                              '&ll=' + latlng +
                              '&radius=500'+
                              '&query=' + query +
                              '&sortByDistance=1' +
                              '&client_id=' + CLIENT_ID +
                              '&client_secret=' + CLIENT_SECRET +
                              '&v=' + version +
                              '&m=foursquare',
                        async: true,

                        success: function(data) {
                            var response = data.response ? data.response : "",
                                groups = response.groups ? response.groups : "",
                                items = groups[0].items ? groups[0].items : "";

                            items.forEach(function(item) {
                                location.fs_hotels.push(item.venue.name);
                            });
                        }
                    });
                }
            });
        });

        // Get POI tips from FourSquare API
        self.fsTips = ko.computed(function() {
            self.myMap().forEach(function(location) {
                if (location.focus() === "POI" && location.fs_id()) {
                    var VENUE_ID = location.fs_id();

                    $.ajax({
                        url: 'https://api.foursquare.com/v2/venues/'+ VENUE_ID +'/tips',
                        dataType: 'json',
                        data: '&client_id=' + CLIENT_ID +
                              '&client_secret=' + CLIENT_SECRET +
                              '&v=' + version +
                              '&m=foursquare',
                        async: true,

                        success: function(data) {
                            var response = data.response ? data.response : "";
                            var tips = response.hasOwnProperty("tips") ? data.response.tips.items : "";
                            tips.forEach(function(tip, i) {
                                if (location.fs_tips()[i] != tip.text) {
                                    location.fs_tips.push(tip.text);
                                }
                            });
                        }
                    });
                }
            });
        });

        /**
         *
         * APIs end
         *
         */

        // Reverse location list order
        self.reverseList = function() {
            self.myMap.reverse();
        };

        // Reset current search
        self.resetSearch = function() {
            google.maps.closeStreetView();
            self.query("");
            self.chosenLocationId("");
            self.goToLocation("");
            self.chosenFocusId("");
            self.goToFocus("");
        };

        // Retrieve categories for focusButtons search functionality
        self.focusButtons = function() {
            var groups = [];
            for (var group in focus) {
                groups.push(group);
            }
            return groups;
        };

        self.goToFocus = function(focus) {
            self.chosenFocusId(focus != self.chosenFocusId() ? focus : "");
            if (selectedInfoWindow) { selectedInfoWindow.close(); }
            // Reset current search
            self.query("");
            self.chosenLocationId("");
            google.maps.closeStreetView();

            // Set only according locations to visible
            self.myMap().forEach(function(location) {
                location.visible(!self.chosenFocusId() || self.chosenFocusId() === location.focus() ? true : false);
                location.marker.setMap(!self.chosenFocusId() || self.chosenFocusId() === location.focus() ? map : null);
            });

            // Fit map to new bounds based on all location positions filtered by selected category
            var currentBounds = new google.maps.LatLngBounds();
            self.searchResults().forEach(function(location) {
                currentBounds.extend(location.marker.position);
            });
            map.fitBounds(currentBounds);
        };

        // Highlight active search result list item
        self.goToLocation = function(location) {
            // Make sure the list item clicked on is not active
            self.chosenLocationId(location != self.chosenLocationId() ? location : "");
            if (self.chosenLocationId()) {self.show_info(location);}
        };

        self.getSelectedLocation = ko.computed(function() {
            self.currentLocation(self.chosenLocationId());
        });

        self.closeInfoWindow = ko.computed(function() {
            if (!self.chosenLocationId()) {
                if (selectedInfoWindow) { selectedInfoWindow.close(); }
            }
        });

        // Trigger Google Maps info window on click
        self.show_info = function(location) {
            google.maps.event.trigger(location.marker,'click');
        };

        self.mouseOverListItem = function(location) {
            google.maps.event.trigger(location.marker,'mouseover');
        };

        self.mouseOutListItem = function(location) {
            google.maps.event.trigger(location.marker,'mouseout');
        };

        //Filter location list and return search result
        self.searchResults = ko.computed(function() {
            var search = self.query().toLowerCase();
            return ko.utils.arrayFilter(self.myMap(), function(location) {
                return location.title().toLowerCase().indexOf(search) >= 0 && location.visible();
            });
        });

        //Filter location list and display only matching locations as markers on the map
        self.mapMarkers = ko.computed(function() {
            var search = self.query().toLowerCase();
            if (search) {
                ko.utils.arrayFilter(self.myMap(), function(location) {
                    location.marker.setMap((location.title().toLowerCase().indexOf(search) >= 0 && location.visible()) ? map : null);
                });
            }
         });
    };

    // Return info string for Google Maps map marker info window
    getInfoString = function(location) {
        var locationCategory = location.fs_cat || location.tag,
            infoString = '<div class="info-window">' +
                         '<h3>' + location.name + '</h3>'+
                         '<p class="address">Address:</p>'+
                         '<p class="address">' + location.address + '</p>'+ '<hr>' +
                         '<p>' + locationCategory + '</p>'+
                         '<a href="' + location.website + '" title="Go to ' + location.website +
                         '" target="_blank">Visit Website</a>' +
                         '</div>';
        return infoString;
    };

    // Check whether location is in map bounds
    checkBounds = function(bounds, location) {
        var position = new google.maps.LatLng(location.coord.lat, location.coord.lng);
        return bounds.contains(position);
    };

    // Google Maps functionality
    ko.bindingHandlers.map = {
        // Initialize Google Maps
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // CREDIT: https://developers.google.com/maps/documentation/javascript/styling?csw=1
            // Create an array of styles
            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control
            var styledMap = new google.maps.StyledMapType(styles,
            {name: "Styled Map"});

            // Create Google Maps map object
            map = new google.maps.Map(element, (new Region(region)).mapOptions);

            //Associate the styled map with the MapTypeId and set it to display
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');

        },
        // Create map markers and map marker functionality
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

            // Get Google Maps app region bounds
            var strictBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(region.bounds[0], region.bounds[1]),
                    new google.maps.LatLng(region.bounds[2], region.bounds[3]));

            var bounds = new google.maps.LatLngBounds();

            //Create Google Maps info window.
            var infowindow = new google.maps.InfoWindow();
                //selectedInfoWindow = infowindow;

            // Get locations data
            var locations = valueAccessor();

            // Generate map markers with different colors
            var pinImages = {},
                pinColors = {"Transportation": "eeb211", "City": "5cb3ff",
                             "Recommended": "ff7563", "POI": "d50f25",
                             "hover": "f0ffff", "visited": "666666"};

            // CREDIT: https://stackoverflow.com/posts/7686977/revisions
            for (var color in pinColors) {
                pinImages[color] = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColors[color],
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0,0),
                    new google.maps.Point(10, 34)
                );
            }

            // Create map markers
            locations().forEach(function(location) {
                marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(
                            location.lat,
                            location.lng),
                    title:  location.name,
                    icon: pinImages[location.focus()],
                    animation: google.maps.Animation.DROP,
                    draggable: false
                });

                location.marker = marker;
                bounds.extend(location.marker.position);
            });

            // Add events to map markers
            locations().forEach(function(location) {

                function toggleBounce() {
                    if( location.marker.getAnimation() !== null) {
                        location.marker.setAnimation(null);
                    } else {
                        location.marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }

                // Open Google Maps info window on click
                google.maps.event.addListener(location.marker, 'click', function() {

                    // Close infowindow immediately on click if any is open

                    // Open the infowindow on marker click
                    // Check if there some info window selected and if is opened then close it
                        if (infowindow.isOpen()) {
                            infowindow.close();
                            selectedInfoWindow = null;
                        }

                        map.panTo(location.marker.getPosition());

                        var infoString = getInfoString(location);

                        viewModel.chosenLocationId(location);

                        toggleBounce();
                        setTimeout(toggleBounce, 500);

                        setTimeout(function() {
                            infowindow.setContent(infoString);
                            selectedInfoWindow = infowindow;
                            selectedInfoWindow.open(map, location.marker);
                        }, 750);

                        // Mark visited map marker green
                        location.marker.setIcon(pinImages.visited);
                        location.visited = true;
                });

                google.maps.event.addListener(infowindow, 'closeclick', function() {
                    viewModel.chosenLocationId("");
                });

                google.maps.event.addListener(location.marker, 'mouseover', function (event) {
                    this.setIcon(pinImages.hover);
                });

                google.maps.event.addListener(location.marker, 'mouseout', function (event) {
                    this.setIcon(pinImages[location.visited ? "visited" : location.focus()]);
                });

            });

            var regionCenter = new google.maps.LatLng(region.center.coord.lat, region.center.coord.lng);

            /* CREDIT: https://developers.google.com/maps/documentation/javascript/examples/streetview-overlays */
            var panoOptions = {
                position: regionCenter,
                addressControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                },
                linksControl: false,
                panControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                enableCloseButton: false
            };

            var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('map-canvas'), panoOptions);
            panorama.setVisible(false);

            panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                heading: 265,
                zoom: 1,
                pitch: 0
            }));

            google.maps.toggleStreetView = function(location) {
                var loc = new google.maps.LatLng(location.lat, location.lng);
                panorama.setPosition(new google.maps.LatLng(location.lat, location.lng));

                // Calculate difference between position of currently selected location and position of current
                // street view image
                var pano = panorama.location.latLng,
                    heading = google.maps.geometry.spherical.computeHeading(pano, loc);

                panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                  heading: heading,
                  zoom: 1,
                  pitch: 0
                }));

                var toggle = panorama.getVisible();
                if (toggle === false) {
                    panorama.setVisible(true);
                } else {
                    panorama.setVisible(false);
                }
            };

            google.maps.openStreetView = function(location) {
                var loc = new google.maps.LatLng(location.lat, location.lng);
                panorama.setPosition(new google.maps.LatLng(location.lat, location.lng));

                var pano = panorama.location.latLng,
                    heading = google.maps.geometry.spherical.computeHeading(pano, loc);

                panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                  heading: heading,
                  zoom: 1,
                  pitch: 0
                }));

                if (panorama.getVisible() === false ) {
                    panorama.setVisible(true);
                }
            };

            google.maps.closeStreetView = function() {
                var visible = panorama.getVisible();
                if (visible === true) {
                    panorama.setVisible(false);
                }
            };

            google.maps.InfoWindow.prototype.isOpen = function() {
                var map = infowindow.getMap();
                return (map !== null && typeof map !== "undefined");
            };

            // Limit the zoom level according to region data object
            google.maps.event.addListener(map, "zoom_changed", function () {
                if (map.getZoom() < region.zoom.min) {
                    map.setZoom(region.zoom.min);
                } else if (map.getZoom() > region.zoom.max) {
                    map.setZoom(region.zoom.max);
                }
            });

            // Capture viewport change and set map center to initial value
/*            google.maps.event.addListener(map, "idle", function () {
                map.setZoom(region.zoom.initial);
                google.maps.event.removeListener(listener);
            });
*/
            // Make sure, the bounds of the current Google Maps region are never left
            // CREDIT: http://jsfiddle.net/cse_tushar/9d4jy4ye/
            google.maps.event.addListener(map, 'dragend', function () {
                if (strictBounds.contains(map.getCenter())) return;
                // We're out of bounds - Move the map back within the bounds
                var c = map.getCenter(),
                x = c.lng(),
                y = c.lat(),
                maxX = strictBounds.getNorthEast().lng(),
                maxY = strictBounds.getNorthEast().lat(),
                minX = strictBounds.getSouthWest().lng(),
                minY = strictBounds.getSouthWest().lat();
                if (x < minX) x = minX;
                if (x > maxX) x = maxX;
                if (y < minY) y = minY;
                if (y > maxY) y = maxY;
                map.setCenter(new google.maps.LatLng(y, x));
            });

            google.maps.event.addDomListener(window, "resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.fitBounds(bounds);
                map.setCenter(center);
            });
        }
    };

    var viewModel = new MyViewModel();

    ko.applyBindings(viewModel);
}
