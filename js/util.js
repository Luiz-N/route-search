function calcDistance(point1, point2) {
  //calculates distance between two lat/lon points in miles
  lat1 = point1.ob;
  lon1 = point1.pb;
  lat2 = point2.ob;
  lon2 = point2.pb;
 var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    // returns distance in meters

    return d * 1600;
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

function deleteCircles() {
  for (var i = 0; i < circles.length; i++) {
    circles[i].setMap(null);
  }
  circles = [];
}

function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function refreshValues() {
  places = [];
  radius = parseInt($('#slider')[0].value);
  start = document.getElementById('start').value;
  end = document.getElementById('end').value;
  travelMode = $('input[name="group1"]:checked').val();
  $("input:checkbox[name=place]:checked").each(function()
  {
    places.push($(this).val());
  });
}

$('#slider').change(function(e) {
 // $('#range')[0].innerHTML = $(e.currentTarget).val();
 // $('#range').html(e.value)
});
