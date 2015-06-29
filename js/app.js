
$(function(data) {
    var initialLocations = data;

    var Location = function(data) {
        this.name = data.name;
        this.address = data.address;
        this.options = data.options;
        this.tag = ko.observable(data.tag);

        this.title = ko.pureComputed(function() {
            return this.name + ", " + this.address + ", " + this.tag();
        }, this);

        this.lat = ko.observable(data.coord.lat);
        this.lng = ko.observable(data.coord.lng);
        this.visible = ko.observable(true);
    };

    var ViewModel = function() {

        var self = this;

        this.query = ko.observable("");
        this.selectedTag = ko.observable("");

        this.mapCenter = ko.observable(neighborhood.center["name"].toUpperCase());

        // Build location list
        this.locationList = ko.observableArray(ko.utils.arrayMap(initialLocations, function(locationItem) {
            return new Location(locationItem)
        }));

        // Sort location list by name property
        this.locationList().sort(function(left, right) {
            return left.name === right.name ? 0 : (left.name < right.name ? -1 : 1)
        })

        this.reverseList = function() {
            self.locationList.reverse();
        }

        // Return unique tag names
        this.uniqueSelect = ko.dependentObservable(function() {
            var tags = ko.utils.arrayMap(self.locationList(), function(item) {
                return item.tag();
            })
            return ko.utils.arrayGetDistinctValues(tags).sort();
        });

        this.searchTags = ko.observableArray(ko.utils.arrayMap(self.uniqueSelect(), function(item) {
            return {tag: item}
        }));

        // Get current tag clicked on and pass it to the query in the search bar
            self.selectedTag(this);
            self.query(self.selectedTag().tag);
        };

        var infowindow = new google.maps.InfoWindow(),
            marker;

        //Bind map markers to locations
        this.locationList().forEach(function(location) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.lat(), location.lng()),
                    map: map,
                    title: location.title(),
                });
                location.marker = marker;
            });

        //Filter location list and return search result
        this.searchResults = ko.computed(function() {
            var search = self.query().toLowerCase();
            return ko.utils.arrayFilter(self.locationList(), function(location) {
                return location.title().toLowerCase().indexOf(search) >= 0;
            });
        });
        
        //Filter location list and display only matching locations as markers on the map
        this.mapMarkers = ko.computed(function() {
            var search = self.query().toLowerCase();
            ko.utils.arrayFilter(self.locationList(), function(location) {
                location.marker.setMap(location.title().toLowerCase().indexOf(search) >= 0 ? map : null);
            });
         });

    };

    // Initialize google maps and center map on Warsaw, Poland.
    var latitude = neighborhood.center["coord"].lat,
        longitude = neighborhood.center["coord"].lng;

    var mapOptions = {
        center: {lat: latitude , lng: longitude},
        zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);


    ko.applyBindings(new ViewModel());
}(locations));

//@TODO: Markers are clickable, and change styling to indicate their selected state
//@TODO: Functionality using third-party APIs when a map marker, search result, or list view entry is clicked
//       (ex. Yelp reviews, Wikipedia, Flickr images, etc). 
//@TODO: 