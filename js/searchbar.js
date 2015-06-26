
$(function(data) {
    var initialLocations = data;


    var Location = function(data) {
        this.name = ko.observable(data.name);
        this.address = ko.observable(data.address);
        this.options = ko.observable(data.options);

        this.title = ko.computed(function() {
            return this.name() + ", " + this.address() + ", " + this.options();
        }, this);

        this.coord = ko.observable(data.coord);
    };
    
    var ViewModel = function() {

        var self = this;

        this.query = ko.observable("");

        this.locationList = ko.observableArray();

        initialLocations.forEach(function(locationItem) {
            self.locationList.push(new Location(locationItem));
        });

        this.searchResults = ko.dependentObservable(function() {
            var search = self.query().toLowerCase();
            return ko.utils.arrayFilter(self.locationList(), function(location) {
                return location.title().toLowerCase().indexOf(search) >= 0;
            });
        });

    };

    ko.applyBindings(new ViewModel());
}(restaurants));