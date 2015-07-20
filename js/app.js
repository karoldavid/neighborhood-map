
//@ TODO: Load data as json 
$(document).ready(function(region, focus, locations, styles) {

    // @TODO: Add POI data (Performing Arts locations)
    var initialLocations = locations, // locations data
        map, // Set map object scope
        selectedInfoWindow;

    // CREDITS: http://learn.knockoutjs.com/
    // Fade message in/ out
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Start visible/invisible according to initial value
            var shouldDisplay = valueAccessor();
            $(element).toggle(shouldDisplay);
        },
        update: function(element, valueAccessor) {
            // On update, fade in/out
            var shouldDisplay = valueAccessor();
            shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
        } 
    };

    // Set Google Maps 'mapOptions' to region definded in app data object
    var Region = function(data) {
        this.mapOptions = {
            center: {lat: data.center["coord"].lat, lng: data.center["coord"].lng},
            zoom: data.zoom.initial,
            panControl: false,
            zoomControl: true,
            scaleControl: true,
            streetViewControl: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style'],
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        };
    };

    // Location 'data' comes from the location object and 'activeTag' is ...
    var Location = function(data, activeTag) {
        this.name = data.name;
        this.marker;
        this.address = data.address;
        this.options = data.options;
        this.website = data.website || "http://#";
        this.tag = data.tag;

        // Create string for search list
        this.title = ko.pureComputed(function() {
            return this.name + ", " + this.address + ", " + this.tag;
        }, this);

        this.focus = ko.computed(function() {

            for (group in focus) {
                if (focus[group].indexOf(this.tag) >= 0) {
                    return group
                }
            }
            return ""; // fallback

        }, this);

        this.lat = data.coord.lat;
        this.lng = data.coord.lng;
        
        // If no tag is active all location items are visible, otherwise only locations with active tag are visible
        this.visible = ko.observable(!activeTag || activeTag === this.tag ? true : false);

        // Get Google Street View image
        this.img = ko.computed(function() {
            return 'https://maps.googleapis.com/maps/api/streetview?size=300x200&location=' + this.lat + ',' + this.lng
            // || 'https://maps.googleapis.com/maps/api/streetview?size=300x200&location=' + this.name
        }, this);

        // Wikipedia API
        this.description = "";
        
        // fourSquare API
        this.fs_cat = "";
        this.fs_id = ko.observable(""); //("4b96b46cf964a52029df34e3");
        //if (this.focus() === "POI") {
            this.fs_photos = ko.observableArray([]);
            this.fs_restaurants = ko.observableArray([]);
            this.fs_hotels = ko.observableArray([]);
        //Fetching 3rd party data only on click/ demand?}
    };

    var GetWikiLinks = function() {
        var self = this;

        this.links = ko.observableArray();

        this.getLinks = ko.computed(function() {

            var wikiRequestLinksTimeout = setTimeout(function() {
                    var $wikiElem = $('#wikipedia');
                    $wikiElem.text('failed to get Wikipedia resources');
                    console.log('failed to get Wikipedia resources');
                }, 5000);

            var wikiQuery = region.center["name"],
            dt = 'jsonp',
            wikiBase = 'http://en.wikipedia.org/w/api.php',
            wikiUrl = wikiBase + '?action=opensearch&search=' + wikiQuery + '&format=json&callback=wikiCallback';
        
            $.ajax({
                    url: wikiUrl,
                    dataType: dt,
                    success: function(response){
                        var titleList = response[1];

                        for (var i = 0; i < titleList.length; i++) {
                            var titleStr = titleList[i],
                                urlStr = 'http://en.wikipedia.org/wiki/' + titleStr;
                            self.links.push({url: urlStr, title: titleStr});
                        };
                    clearTimeout(wikiRequestLinksTimeout);
                }
            });
        });
    };


    var GetWeather = function() {
        var self = this;
        
        self.weatherStr = ko.observable("");

        var weather = 'http://api.openweathermap.org/data/2.5/weather?' +
                      'lat=' + region.center["coord"].lat +
                      '&lon=' + region.center["coord"].lng;

        $.getJSON(weather, function(response) {
            self.weatherStr(response.weather[0].description + "   " + Math.round(response.main.temp - 273.15) + " °C");
        });
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
        return deg * (Math.PI/180)
    }

    //
    var MyViewModel = function() {
       
        var self = this;

        self.query = ko.observable(""); // Search box query string
        self.chosenTagId = ko.observable(""); // Selected tag in tag cloud
        self.chosenLocationId = ko.observable(""); // Selected location item in locations item list

        self.chosenFocusId = ko.observable("");

        // @TODO: Make map region changeable on click
        self.region = region.center["name"].toUpperCase(); // Map region string for header app info
        self.distance = Math.round(getDistanceFromLatLonInKm(region.center["coord"].lat, region.center["coord"].lng, 37.362517, -122.03476)) +
                        ' km to Silicon Valley';

        // Sort location list by name property
        initialLocations.sort(function(left, right) {
            return left.name === right.name ? 0 : (left.name < right.name ? -1 : 1)
        });

        // Initialize Google Maps Markers
        self.myMap = ko.observableArray(ko.utils.arrayMap(initialLocations, function(locationItem) {
            return new Location(locationItem, "")
        }));

        self.currentLocation = ko.observable("");

        /**
         *
         * APIs start
         *
         */

        /*var data = functionThatGetsAPIData();
        this.thing = ko.mapping.fromJS(data);*/

        /*var apiCall = $.get('http://example.com/api');
        
        apiCall.done(function(data) {
          // success
        });  

        apiCall.fail(function(xhr, err) {
          // failure
        }); */

        // @TODO: Check error message
        // Get from Open Weather Map API current weather description and temperature
        self.weather = new GetWeather().weatherStr; // Current weather string for header app info

        // @TODO: Check error message
        // @TODO: Fetch data on click only
        // Get from Wikipedia API url and title for region info link list 

        self.wikipediaLinks = new GetWikiLinks().links;

        // @TODO: Cach venue details (for up to 30 days)
        // @TODO: Check error message
        // @TODO: Retrieve POI data 
        // Get from fourSquare API proper location categories
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

        // @TODO: Cach venue details (for up to 30 days)
        // @TODO: Check error message
        // @TODO: Retrieve POI data
        // Get from fourSquare API venue photos
        self.fsPhotos = ko.computed(function() {
            self.myMap().forEach(function(location, i) {
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
                            
                            photos.forEach(function(photo, i) {
                                if (i < 10) {
                                    location.fs_photos.push(photo.prefix + 'width' + photo.width + photo.suffix);
                                }
                            });
                        }
                    });
                }
            });
        });

        // @TODO: Cach nearBy details (for up to 30 days)
        // @TODO: Check error message
        // Get from fourSquare API POI nearyBy data
        self.fsNearyBy = ko.computed(function() {
            self.myMap().forEach(function(location,i) {
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

        // @TODO: Cach nearBy details (for up to 30 days)
        // @TODO: Check error message
        // Get from fourSquare API POI nearyBy data
        self.fsNearyBy = ko.computed(function() {
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
                            console.log(items);
                            items.forEach(function(item) {
                                location.fs_hotels.push(item.venue.name);
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
        }
        
        // Reset search
        self.resetSearch = function() {
            self.query("");
            self.chosenTagId("");
            self.chosenLocationId("");
            self.goToTag("");
            self.goToLocation("");
        }
        
        // Retrieve only unique tags from locations data
        self.uniqueSelect = function() {
            var tags = ko.utils.arrayMap(self.myMap(), function(item) {
                return item.tag;
            })
            return ko.utils.arrayGetDistinctValues(tags).sort();
        };
        
        // Build search tag array for the tag cloud in the View
        self.searchTags = ko.utils.arrayMap(self.uniqueSelect(), function(tag) {
            return tag
        });

        self.focusButtons = function() {
            var groups = [];
            for (group in focus) {
                groups.push(group)
            }
            return groups;
        };

        self.goToFocus = function(focus) {
            self.chosenFocusId(focus != self.chosenFocusId() ? focus : "");
            if (selectedInfoWindow) {selectedInfoWindow.close()};
            // Reset current search
            self.query("");
            self.chosenLocationId("");

            // Set only according locations to visible
            self.myMap().forEach(function(location) {
                location.visible(!self.chosenFocusId() || self.chosenFocusId() === location.focus() ? true : false);
                location.marker.setMap(!self.chosenFocusId() || self.chosenFocusId() === location.focus() ? map : null);
            });
            
            // @TODO: How to handle everything map related in the 'Google Maps bindingHandler'?
            // Fit map to new bounds based on all location positions filtered by tag
            var currentBounds = new google.maps.LatLngBounds();
            self.searchResults().forEach(function(location) {
                currentBounds.extend(location.marker.position);
            });
            map.fitBounds(currentBounds);
        };

        // Highlight selected search tag as active and filter location list accordingly
        self.goToTag = function(tag) {
            // Make sure the tag clicked on is not active
            self.chosenTagId(tag != self.chosenTagId() ? tag : "");
            if (selectedInfoWindow) {selectedInfoWindow.close()};
            // Reset current search
            self.query("");
            self.chosenLocationId("");

            // Set only according locations to visible
            self.myMap().forEach(function(location) {
                location.visible(!self.chosenTagId() || self.chosenTagId() === location.tag ? true : false);
                location.marker.setMap(!self.chosenTagId() || self.chosenTagId() === location.tag ? map : null);
            });
            
            // @TODO: How to handle everything map related in the 'Google Maps bindingHandler'?
            // Fit map to new bounds based on all location positions filtered by tag
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
                if (selectedInfoWindow) {selectedInfoWindow.close()};
            }
        });

        // Trigger Google Maps info window on click
        self.show_info = function(location) {
            google.maps.event.trigger(location.marker,'click');
        }

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

    // Return info string for Google Maps location info window
    getInfoString = function(location) {

        var locationCategory = location.fs_cat || location.tag;

        var infoString = '<div id="iw-container">' +
                         '<h2 class="iw-title">' + location.name + '</h2>'+
                         '<div class="iw-body">' +
                         //'<h3>Info</h3>' +
                        // '<p>' + location.description + '</p>' +
                         '<img class="iw-img" src="' + location.img() + '">' + //'<hr>' +
                         //'<p>' + location.address + '</p>'+ '<hr>' +
                         '<p>' + locationCategory + " " + '<a href="' + location.website + '" title="Go to ' + location.website +
                         '" target="_blank">Visit Website</a>' + '</p>' + 
                         '</div>' + 
                         '</div>';

        return infoString;
    }
    
    // Check whether location is in map bounds
    checkBounds = function(bounds, location) {
        var position = new google.maps.LatLng(location.coord.lat, location.coord.lng);
        return bounds.contains(position);
    }

    // Google Maps functionality
    ko.bindingHandlers.map = {

        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

            // SOURCE: https://developers.google.com/maps/documentation/javascript/styling?csw=1
            // Create an array of styles
            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control

            var styledMap = new google.maps.StyledMapType(styles,
            {name: "Styled Map"});
            
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

            // Create Google Maps map object
            map = new google.maps.Map(element, (new Region(region)).mapOptions);

            //Associate the styled map with the MapTypeId and set it to display.
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');

            // @TODO: Filter locations that are not within app region bounds
            /*locations().forEach(function(location, index) {
                if (!checkBounds(strictBounds, location)) {
                    locations().splice(index, 1);
                }
            });*/

            // Generate map markers with different colors
            var pinColors = {"Transportation": "eeb211", "City": "5cb3ff", "Recommended": "ff7563", "POI": "d50f25", "visited": "666666"};

            var pinImages = {};

            // @CREDITS: https://stackoverflow.com/posts/7686977/revisions
            for (color in pinColors) {
                pinImages[color] = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColors[color],
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0,0),
                    new google.maps.Point(10, 34)
                );
            }

            // Create location markers
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
            
            // Add events to markers
            locations().forEach(function(location) {

                function toggleBounce() {
                    if( location.marker.getAnimation() != null) {
                        location.marker.setAnimation(null);
                    } else {
                        location.marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }

                // @TODO: Close info window when active marker is clicked
                // @TODO: Highlight search list item when marker is active
                // Open Google Maps info window on click
                google.maps.event.addListener(location.marker, 'click', function() {
 
                    // Close infowindow immediately on click if any is open

                    // Open the infowindow on marker click
                    //Check if there some info window selected and if is opened then close it
                        if (infowindow.isOpen()) {
                            infowindow.close();
                            selectedInfoWindow = null;
                        }

                        //map.setZoom(16);

                        map.panTo(location.marker.getPosition());
                        
                        var infoString = getInfoString(location);

                        viewModel.chosenLocationId(location);

                        // @TODO: Scroll to active location list item
                        // var selected = $('ul #locList > li.selected');
                        // console.log(selected);

                        toggleBounce();
                        setTimeout(toggleBounce, 500);

                        setTimeout(function() {
                            infowindow.setContent(infoString);
                            selectedInfoWindow = infowindow;
                            selectedInfoWindow.open(map, location.marker);
                        }, 750);

                        // Mark visited marker green
                        location.marker.setIcon(pinImages["visited"]);
                        //location.marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
                });

                google.maps.event.addListener(infowindow, 'closeclick', function() {
                    //marker.setMap(null);
                    viewModel.chosenLocationId("");
                });
            });

                        
            var wawaCenter = new google.maps.LatLng(region.center['coord'].lat, region.center['coord'].lng);

            var panoramaOptions = {
                position: wawaCenter,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            };

           //var panorama = new google.maps.StreetViewPanorama(document.getElementById('panorama'), panoramaOptions);
           //map.setStreetView(panorama);

            google.maps.InfoWindow.prototype.isOpen = function(){
                var map = infowindow.getMap();
                return (map !== null && typeof map !== "undefined");
            }

            // Limit the zoom level according to region data object
            google.maps.event.addListener(map, "zoom_changed", function () {
                if (map.getZoom() < region.zoom.min) {
                    map.setZoom(region.zoom.min);
                } else if (map.getZoom() > region.zoom.max) {
                    map.setZoom(region.zoom.max);
                }
            });

            // @TODO: Check functionality
            var listener = google.maps.event.addListener(map, "idle", function () {
                map.setZoom(region.zoom.initial);
                google.maps.event.removeListener(listener);
            });

            // Limit the zoom level according to app region data object
            google.maps.event.addListener(map, "zoom_changed", function () {
                if (map.getZoom() < region.zoom.min) {
                    map.setZoom(region.zoom.min);
                } else if (map.getZoom() > region.zoom.max) {
                    map.setZoom(region.zoom.max);
                }
            });

            // Make sure, that bounds of Google Maps region are never left
            // CREDIT TO: http://jsfiddle.net/cse_tushar/9d4jy4ye/
            google.maps.event.addListener(map, 'dragend', function () {
                if (strictBounds.contains(map.getCenter())) return
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
 
    // @TODO: Check error message
    // Show error message if google is not defined
    setTimeout(function () {
        try{
            if (!google || !google.maps) {
            }
        }
        catch (e) {
            var $error_elem = $('#map-canvas');
            $error_elem.text('Sorry, An Error Occured. Google Maps Could Not Be Reached.');
        }
    }, 1000);

    var viewModel = new MyViewModel();

    ko.applyBindings(viewModel);
}(neighborhood.region, neighborhood.focus, neighborhood.locations, styles));

//@TODO: Write code required to add map markers identifying a number of locations you are interested in within this neighborhood
//@TODO: Searchbox Text updates item list and map markers instantly when user types
//@TODO: Markers are clickable, and change styling to indicate their selected state
//@TODO: Markers bounce on click
//@TODO: SHOW GOOGLE MAPS ERROR MESSAGE WHEN RESPONSE FAILS
//@TODO: When list item is clicked, highlight marker/ open marker info window
//@TODO: Functionality using third-party APIs when a map marker, search result, or list view entry is clicked
//       (ex. Yelp reviews, Wikipedia, Flickr images, Kayak, etc).
//@TODO: Integrate https://www.firebase.com/ to Exceed Specifications

//@TODO: Additional 3rd party API
//@TODO: Optimize Performance

//@NOTES: KNOCKOUTJS: MODEL VIEW VIEW MODEL Pattern
//@NOTES: RESPONSIVE Design
//@NOTES: USER EXPERIENCE | UI
//@NOTES: PRODUCTION CODE with grunt/gulp

