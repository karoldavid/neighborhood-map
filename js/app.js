
$(function(data) {
    var initialLocations = data;


    var Location = function(data) {
        this.name = ko.observable(data.name);
        this.address = ko.observable(data.address);
        this.options = ko.observable(data.options);
        this.tag = ko.observable(data.tag);

        this.title = ko.computed(function() {
            return this.name() + ", " + this.address() + ", " + this.tag();
        }, this);

        this.lat = ko.observable(data.coord.lat);
        this.lng = ko.observable(data.coord.lng);
        this.visible = ko.observable(true);
    };

    var ViewModel = function() {

        var self = this;
        this.query = ko.observable("");
        this.locationList = ko.observableArray();

       
        initialLocations.forEach(function(locationItem) {
            self.locationList.push(new Location(locationItem));
        });

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