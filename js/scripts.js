var geocoder;
var circles = [];
var markers = [];
var places = [];
var pointers = {};

DRIVING = google.maps.DirectionsTravelMode.DRIVING;
TRANSIT = google.maps.DirectionsTravelMode.TRANSIT;
WALKING = google.maps.DirectionsTravelMode.WALKING;
BICYCLING = google.maps.DirectionsTravelMode.BICYCLING;
directionsService = new google.maps.DirectionsService();
var chicago = new google.maps.LatLng(41.88,-87.63);
// radius = 800;
// start = document.getElementById('start').value;
// end = document.getElementById('end').value;





function initialize() {
  mapOptions = {
    center: chicago,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.Roadmap
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  geocoder = new google.maps.Geocoder();
  directionsDisplay = new google.maps.DirectionsRenderer();
  Places = new google.maps.places.PlacesService(map);
}


$(document).ready(function() {

  initialize();
});

function newRoute() {
  refreshValues();
  deleteCircles();
  deleteMarkers();
  
  request = {
      origin:start,
      destination:end,
      travelMode:travelMode
  };
  //drawRoute(result, status)
  directionsService.route(request, function callback (directions,status) {
    if (status == google.maps.DirectionsStatus.OK) 
    routes = directions.routes[0];

    drawRoute(directions,status);
    findCircles(routes.legs[0].steps);
  });
}

function findCircles(steps) {
  points = []
  finalPoints = []
  orderedFinalPoints = []
  //flattens all the points into one array
  for (var i = 0; i < steps.length; i++) {
    for (var j = 0; j < steps[i].path.length; j++) {
       points.push(steps[i].path[j]); 
     };
  };
  // console.log(points);
  //goes through all the points and finds the next one that is radius distance away
  startingPoint = points[0];
  endingPoint = points[points.length-1];
  finalPoints.push(startingPoint);
  for (var i = 0; i < points.length-1; i++) {
    distance = calcDistance(finalPoints[finalPoints.length-1],points[i])
    // console.log(distance);
    if (distance >= radius+(radius*.35)) {finalPoints.push(points[i])};
  };
  finalPoints.push(endingPoint);
  //reorders the points to start from point A
  for (var i = finalPoints.length - 1; i >= 0; i--) {
    orderedFinalPoints.push(finalPoints[i]);
  };
  //creates and draws circles
  createCircles(orderedFinalPoints)
  //function for searching place within array of circles
  findPlaces(orderedFinalPoints)
}

function createCircles(points){
  for (var i = points.length - 1; i >= 0; i--) {
    CircleCoordinates = points[i];
  var lat = CircleCoordinates.ob;
  var lng = CircleCoordinates.pb;
  
  circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      center: new google.maps.LatLng(lat, lng),
      radius: radius
  });
    drawCircle(circle);
    circles.push(circle);
  }
}

function findPlaces (circles) {
  // console.log(circles);
  var circle = circles.pop();

  var lat = circle.ob;
  var lon = circle.pb;

  var request = {
    location: new google.maps.LatLng(lat,lon),
    radius: radius,
    types: places.length == 0 ? nil : places
  };
  // console.log(places);
  Places.nearbySearch(request, createMarkers);
  // console.log(request)
  if (circles.length == 0) {
    console.log("finished loading pins");
  }
  else{
    setTimeout(function(){findPlaces(circles,radius)},350);
    }
  }

function createMarkers(results, status) {
    console.log(results.length);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var point = results[i];

      console.log(point);
      var lat = point.geometry.location.ob;
      var lon = point.geometry.location.pb;

        marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lon),
        icon: iconBase + point.types[0] + '.png'
      });

      drawMarker(marker);
      markers.push(marker);

      // console.log(this.marker);
      self = this.marker
      pointers[i] = this.marker;

        google.maps.event.addListener(pointers[i], 'click', function() {
          console.log(pointers[i]);
          console.log(point);
          
          Places.getDetails(this.point, function(result, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
            }
          var infoWindow = new google.maps.InfoWindow();
          infoWindow.setContent(result.name);
          infoWindow.open(map, marker);
        });
      });
      }
    }
  };

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

function drawRoute (directions, status) {
  directionsDisplay.setMap(map);
  directionsDisplay.setDirections(directions);
}

function drawCircle(circle){
  circle.setMap(map);
}

function drawMarker(marker) {
  marker.setMap(map);
}

var iconBase = 'https://googledrive.com/host/0B5fU7GSkrnMzT3ZQNDc5M0dJYkU/';

// var icons = {
//   bar: {
//     icon: iconBase + 'bar.png'
//   }
// };

bar = 'bar.png';
