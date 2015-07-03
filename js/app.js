
$(function(region, locations) {
    var initialLocations = locations;

    var Region = function(data) {
        this.mapOptions = {
            center: {lat: data.center["coord"].lat , lng: data.center["coord"].lng},
            zoom: data.zoom
        };
    };

    var Location = function(data, activeTag) {
        this.name = data.name;
        this.address = data.address;
        this.options = data.options;
        this.tag = data.tag;

        this.title = ko.pureComputed(function() {
            return this.name + ", " + this.address + ", " + this.tag;
        }, this);

        this.lat = data.coord.lat;
        this.lng = data.coord.lng;
        
        // If no tag is active all location items are visible, otherwise only locations with active tag
        this.visible = ko.observable(!activeTag || activeTag === this.tag ? true : false);
    };


    var ViewModel = function() {

        var self = this;

        self.query = ko.observable("");
        self.chosenTagId = ko.observable();
        self.chosenLocationId = ko.observable();

        self.mapCenter = ko.observable(region.center["name"].toUpperCase());

        // Build location list
        self.locationList = ko.observableArray(ko.utils.arrayMap(initialLocations, function(locationItem) {
            return new Location(locationItem, "")
        }));

        // Sort location list by name property
        self.locationList().sort(function(left, right) {
            return left.name === right.name ? 0 : (left.name < right.name ? -1 : 1)
        })
        
        // Reverse location list order
        self.reverseList = function() {
            self.locationList.reverse();
        }
        
        // Retrieve only unique tags form the location list
        self.uniqueSelect = function() {
            var tags = ko.utils.arrayMap(self.locationList(), function(item) {
                return item.tag;
            })
            return ko.utils.arrayGetDistinctValues(tags).sort();
        };
        
        // Build search tag array
        self.searchTags = ko.utils.arrayMap(self.uniqueSelect(), function(tag) {
            return tag
        });

        // Highlight active search
        self.goToTag = function(tag) {
            self.chosenTagId(tag);

            // Get current tag clicked on and set only respective locations to visible
            self.locationList().forEach(function(location) {
                location.visible(!tag || tag === location.tag ? true : false);
            });

        };

        // Highlight active search result list item
        self.goToLocation = function(location) {
            self.chosenLocationId(location);
        };

        // Initialize google maps and center map 
        var map = new google.maps.Map(document.getElementById('map-canvas'),
                      (new Region(region)).mapOptions);

        //Create a new info window.
        var infowindow = new google.maps.InfoWindow();

        var marker;

        //Set map markers and define info window
        self.locationList().forEach(function(location) {
            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(location.lat, location.lng),
                            map: map,
                            title: location.name,
                            animation: google.maps.Animation.DROP
                        });

            location.marker = marker;

            function toggleBounce() {
                if(location.marker.getAnimation() != null) {
                    location.marker.setAnimation(null);
                } else {
                    location.marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            google.maps.event.addListener(location.marker, 'click', function(){
                var infoString = '<div id="iw-container">' +
                                 '<h2 class="iw-title">' + location.name + '</h2>'+
                                 '<div class="iw-body">' +
                                 '<h3>History</h3>' +
                                 '<p>When the user edits the value in the associated' +
                                 'form control, it updates the value on your view model.' +
                                 'Likewise, when you update the value in your view model, this updates the value</p>' +
                                 '<p>' + location.address + '</p>' +
                                 '<p>' + location.tag + '</p>' +
                                 '</div>' +
                                 //'<div class="iw-footer">' +
                                 //'<a href="mailto:k.zysk@zoho.com" title="email to k.zysk@zoho.com" target="_self">&#9993;</a>' +
                                 //'</div>' + 
                                 '</div>';
            
                toggleBounce();
                setTimeout(toggleBounce, 2000);

                setTimeout(function() {
                    infowindow.setContent(infoString);
                    infowindow.open(map, location.marker);
                }, 1000);

                location.marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
            
            });
        });

        //Filter location list and return search result
        self.searchResults = ko.computed(function() {
            var search = self.query().toLowerCase();
            return ko.utils.arrayFilter(self.locationList(), function(location) {
                return location.title().toLowerCase().indexOf(search) >= 0 && location.visible();
            });
        });
        
        //Filter location list and display only matching locations as markers on the map
        self.mapMarkers = ko.computed(function() {
            var search = self.query().toLowerCase();
            ko.utils.arrayFilter(self.locationList(), function(location) {
                location.marker.setMap((location.title().toLowerCase().indexOf(search) >= 0 && location.visible()) ? map : null);
            });
         });

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center); 
        });
    };
    
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

    ko.applyBindings(new ViewModel());
}(neighborhood.region, neighborhood.locations));

//@TODO: Write code required to add map markers identifying a number of locations you are interested in within this neighborhood
//@TODO: Searchbox Text updates item list and map markers instantly when user types
//@TODO: Markers are clickable, and change styling to indicate their selected state
//@TODO: Markers bounce on click
//@TODO: SHOW GOOGLE MAPS ERROR MESSAGE WHEN RESPONSE FAILS
//QTODO: When list item is clicked, highlight marker/ open marker info window
//@TODO: Functionality using third-party APIs when a map marker, search result, or list view entry is clicked
//       (ex. Yelp reviews, Wikipedia, Flickr images, etc).

//@TODO: Additional 3rd party API
//@TODO: Optimmize Performance

//@NOTES: KNOCKOUTJS: MODEL VIEW VIEW MODEL Pattern
//@NOTES: RESPONSIVE Design
//@NOTES: USER EXPERIENCE | UI
//@NOTES: PRODUCTION CODE with grunt/gulp
