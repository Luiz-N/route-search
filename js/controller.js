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
