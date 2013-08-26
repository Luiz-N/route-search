var geocoder;
var circles = [];
var markers = [];
directionsService = new google.maps.DirectionsService();
var chicago = new google.maps.LatLng(41.88,-87.63);
// radius = 800;
// start = document.getElementById('start').value;
// end = document.getElementById('end').value;





function initialize() {
  mapOptions = {
    center: chicago,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  geocoder = new google.maps.Geocoder();
  directionsDisplay = new google.maps.DirectionsRenderer();
  Places = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();
}



$(document).ready(function() {

  initialize();
  // newRoute();

});
