var geocoder;
var circles = [];
var markers = [];
var places = [];

// var searchBox = document.getElementById('search').value;
// var searchBox = new google.maps.places.SearchBox(input);
var chicago = new google.maps.LatLng(41.88,-87.63);


DRIVING = google.maps.DirectionsTravelMode.DRIVING;
TRANSIT = google.maps.DirectionsTravelMode.TRANSIT;
WALKING = google.maps.DirectionsTravelMode.WALKING;
BICYCLING = google.maps.DirectionsTravelMode.BICYCLING;
directionsService = new google.maps.DirectionsService();




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
  service = new google.maps.places.PlacesService(map);

  grabLocation();


}






$(document).ready(function() {

  initialize();

  $('#map-canvas').css('width', '100%');






  $('.circle').click(function(e) {
    e.stopPropagation();
    $('.circle').removeClass('selected');
    $('.circle span').removeClass('selected');

    $(this).addClass('selected');
    $(this).children('span').addClass('selected');
  });










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
  console.log(points);
  //goes through all the points and finds the next one that is radius distance away
  startingPoint = points[0];
  endingPoint = points[points.length-1];
  finalPoints.push(startingPoint);
  for (var i = 0; i < points.length-1; i++) {
    distance = calcDistance(finalPoints[finalPoints.length-1],points[i])
    // console.log(distance);
    if (distance >= radius+(radius*.35)) {
      finalPoints.push(points[i])
    };
  };
  finalPoints.push(endingPoint);
  console.log(finalPoints);
  //reorders the points to start from point A
  for (var i = finalPoints.length - 1; i >= 0; i--) {
    orderedFinalPoints.push(finalPoints[i]);
  };
  //creates and draws circles
  createCircles(orderedFinalPoints);
  //function for searching place within array of circles
  // findSearchResults(orderedFinalPoints);
  findPlaces(orderedFinalPoints);
}

function createCircles(points){
  for (var i = points.length - 1; i >= 0; i--) {
  
  circle = new google.maps.Circle({
      strokeColor: 'FF4040',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: 'FF4040',
      fillOpacity: 0.1,
      center: points[i],
      radius: radius
  });
    drawCircle(circle);
    circles.push(circle);
  }
}

function findPlaces (circles) {
  var circle = circles.pop();

  var request = {
    location: circle,
    radius: radius,
    types: places.length == 0 ? nil : places
  };

  Places.nearbySearch(request, createMarkers);

  if (circles.length == 0) {
    console.log("finished loading pins");
  }
  else{
    setTimeout(function(){findPlaces(circles)},350);
  }
}

function createMarkers(places) {
    // console.log(places.length);
      for (var i = 0; i < places.length; i++) {
        var place = places[i];

        var marker = new google.maps.Marker({
          position: place.geometry.location,
          icon: iconBase + place.types[0] + '.png'
        });

        drawMarker(marker);
        markers.push(marker);

        var context = {
          marker: marker,
          place: place
        };

        google.maps.event.addListener(marker, 'click', function() {
          Places.getDetails(this.place, function(result, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
              alert(status);
              return;
            }
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(result.name);
            infoWindow.open(map, this.marker);
          }.bind(this));
        }.bind(context));
      }
  };

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
