function refreshValues() {
  places = [];
  // radius = parseInt($('#slider')[0].value);
  radius = $('#radius .selected').data('distance');
  start = document.getElementById('start').value;
  end = document.getElementById('end').value;
  travelMode = $('input[name="group1"]:checked').val();
  $("input:checkbox[name=place]:checked").each(function()
  {
    places.push($(this).val());
  });
}





function calcDistance(point1, point2) {
  //calculates distance between two lat/lon points in miles

  lat1 = point1[[Object.keys(point1)[0]]];
  lon1 = point1[[Object.keys(point1)[1]]];
  lat2 = point2[[Object.keys(point2)[0]]];
  lon2 = point2[[Object.keys(point2)[1]]];

 var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    // returns distance in meters
    // console.log(d);
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


function grabLocation () {
  if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map.setCenter(initialLocation);
      }, function() {
        handleNoGeolocation(browserSupportFlag);
      });
    }
    // Browser doesn't support Geolocation
    else {
      browserSupportFlag = false;
      handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
      if (errorFlag == true) {
        console.log("Geolocation service failed.");
        // initialLocation = Houston;
      } else {
        console.log("Your browser doesn't support geolocation. We've placed you in Siberia.");
        // initialLocation = siberia;
      }
      // map.setCenter(initialLocation);
    }
  
}

function findSearchResults(circles){
  console.log(circles)
  var circle = circles.pop();

  var request = {
      location: circle,
      radius: 5,
      query: document.getElementById('search').value
    };

  service.textSearch(request, createMarkers);

  if (circles.length == 0) {
    console.log("finished loading pins");
  }
  else{
    setTimeout(function(){findSearchResults(circles)},350);
  }

}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

if (typeof(Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}






