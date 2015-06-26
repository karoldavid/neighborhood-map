
   
function initialize() {
	var latitude = neighborhood.center["coord"].lat,
	    longitude = neighborhood.center["coord"].lng;

	var mapOptions = {
        center: {lat: latitude , lng: longitude},
        zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // var infowindow = new google.maps.InfoWindow();
    // var geocoder = new google.maps.Geocoder();

    // var marker, i;

    // for (i = 0; i < locations.length; i++) {

    //     geocoder.geocode( { 'address': locations[i][1]}, function(results, status) {
    //         //alert(status);
    //         if (status == google.maps.GeocoderStatus.OK) {

    //             //alert(results[0].geometry.location);
    //             console.log(results[0].geometry.location);
    //             map.setCenter(results[0].geometry.location);
    //             marker = new google.maps.Marker({
    //                 position: results[0].geometry.location,
    //                 map: map
    //             }); 

    //             google.maps.event.addListener(marker, 'mouseover', function() { infowindow.open(marker, map);});
    //             google.maps.event.addListener(marker, 'mouseout', function() { infowindow.close();});

    //         }
    //         else
    //         {
    //             alert("some problem in geocode" + status);
    //         }
    //     }); 
    // }
}

function loadScript() {
  var API_KEY = "AIzaSyDfBRThn5FwVjH451Lo-oeK-rGHsPRVzWg",
      script = document.createElement("script");
  
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&sensor=TRUE_OR_FALSE&callback=initialize";

  setTimeout(function () {
        try{
            if (!google || !google.maps) {
                //This will Throw the error if 'google' is not defined
            }
        }
        catch (e) {
        	var $error_elem = $('#map-canvas');
           //alert('google not reachable');
            $error_elem.text('Sorry, An Error Occured. Google Maps Could Not Be Reached.');
        }
    }, 5000);
  
  document.body.appendChild(script);
}

window.onload = loadScript;

//TODO: Write code required to add map markers identifying a number of locations you are interested in within this neighborhood.

