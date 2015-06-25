var neighborhood = {
		location: {
			"name": "Warsaw",
			"coord": [{"lat": 52.232938, "lng":  21.0611941}]
		}
	};
    
function initialize() {
	var latitude = neighborhood.location["coord"][0].lat,
	    longitude = neighborhood.location["coord"][0].lng;

	var mapOptions = {
        center: { lat: latitude , lng: longitude},
        zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
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