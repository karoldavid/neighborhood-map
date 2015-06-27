var infowindow = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder();

    var marker, i;

    for (i = 0; i < locations.length; i++) {

        geocoder.geocode( { 'address': locations[i][1]}, function(results, status) {
            //alert(status);
            if (status == google.maps.GeocoderStatus.OK) {

                //alert(results[0].geometry.location);
                console.log(results[0].geometry.location);
                map.setCenter(results[0].geometry.location);
                marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                }); 

                google.maps.event.addListener(marker, 'mouseover', function() { infowindow.open(marker, map);});
                google.maps.event.addListener(marker, 'mouseout', function() { infowindow.close();});

            }
            else
            {
                alert("some problem in geocode" + status);
            }
        }); 
    }