
$(function() {
    var restaurants = [
        {
            name: "Bar mleczny",
            address: "Marymoncka 49, Warszawa - Poland",
            options: "Lunch"
        },
        {
            name: "Restauracja Polska Rozana",
            address: "Chocimska 7, Warsaw - Poland",
            options: "Lunch, Dinner, Dessert"
        },
        {
            name: "Stara Kamienica",
            address: "Str. Widok 8, Warsaw - Poland",
            options: "Brunch, Lunch, Dinner, Dessert"
        },
        {
            name: "U Kucharzy",
            address: "Długa 52, Warsaw - Poland",
            options: "Dinner, Dessert"
        }];

    var viewModel = {
        query: ko.observable('')
    };

    viewModel.restaurants = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(restaurants, function(restaurant) {
            return restaurant.options.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);

    ko.applyBindings(viewModel);
});