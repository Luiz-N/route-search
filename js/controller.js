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











