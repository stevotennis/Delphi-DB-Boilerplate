
var geocoder;
var map, layer;

function initialize() {
  geocoder = new google.maps.Geocoder();
  var sandiego = new google.maps.LatLng(32.877491, -117.235276);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: sandiego,
    zoom: 11
  });

  layer = new google.maps.FusionTablesLayer({
    query: {
      select: 'BLOCK_ADDRESS ,San Diego, CA ZipCode',
      from: '1VyhdgtU_C8wI-ZKXChzbbCsTchJA-zhPzOgjq6OL',
      where: 'activityDate = 1/5/15'
    }
  });
  layer.setMap(map);
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);