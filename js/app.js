
$(function(region, locations) {
    var initialLocations = locations;

    var Region = function(data) {
        this.mapOptions = {
            center: {lat: data.center["coord"].lat , lng: data.center["coord"].lng},
            zoom: data.zoom
        };
    };

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

        this.availableOptions = [
            { optionName: "Name"},
            { optionName: "Address"},
            { optionName: "Tag"}

        ];

        this.selectedOption = ko.observable("");

        // Initialize google maps and center map on Warsaw, Poland.
        var map = new google.maps.Map(document.getElementById('map-canvas'),
                      (new Region(region)).mapOptions);

        //Create a new info window.
        var infowindow = new google.maps.InfoWindow();


        this.query = ko.observable("");
        this.selectedTag = ko.observable("");

        this.mapCenter = ko.observable(region.center["name"].toUpperCase());

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
        this.selectTag = function() {
            self.selectedTag(this);
            self.query(self.selectedTag().tag);
        };

        var marker;

        //Set map markers and define info window
        this.locationList().forEach(function(location) {
            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(location.lat(), location.lng()),
                            map: map,
                            title: location.name,
                            animation: google.maps.Animation.DROP
                        });

            location.marker = marker;

            google.maps.event.addListener(location.marker, 'click', function(){
                var infoString = '<div id="iw-container">' +
                                 '<h2 class="iw-title">' + location.name + '</h2>'+
                                 '<div class="iw-body">' +
                                 '<h3>History</h3>' +
                                 '<p>When the user edits the value in the associated' +
                                 'form control, it updates the value on your view model.' +
                                 'Likewise, when you update the value in your view model, this updates the value</p>' +
                                 '<p>' + location.address + '</p>' +
                                 '<p>' + location.tag() + '</p>' +
                                 '</div>' +
                                 //'<div class="iw-footer">' +
                                 //'<a href="mailto:k.zysk@zoho.com" title="email to k.zysk@zoho.com" target="_self">&#9993;</a>' +
                                 //'</div>' + 
                                 '</div>';
            
                infowindow.setContent(infoString);
                infowindow.open(map, location.marker);
                marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
            
            });
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

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center); 
        });
    };

    ko.applyBindings(new ViewModel());
}(neighborhood.region, neighborhood.locations));

//@TODO: Markers are clickable, and change styling to indicate their selected state
//@TODO: Functionality using third-party APIs when a map marker, search result, or list view entry is clicked
//       (ex. Yelp reviews, Wikipedia, Flickr images, etc). 
//@TODO: 