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
