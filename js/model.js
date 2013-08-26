function newRoute() {
  refreshValues();
  deleteCircles();
  deleteMarkers();
  
  request = {
      origin:start,
      destination:end,
      travelMode: travelMode
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
  //goes through all the points and finds the next one that is radius distance away
  startingPoint = points[0];
  endingPoint = points[points.length-1];
  finalPoints.push(startingPoint);
  for (var i = 0; i < points.length-1; i++) {
    distance = calcDistance(finalPoints[finalPoints.length-1],points[i])
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
  lat = CircleCoordinates.mb;
  lng = CircleCoordinates.nb;
  
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
  console.log(circles);
  circle = circles.pop();

  lat = circle.mb;
  lon = circle.nb;

  request = {
    location: new google.maps.LatLng(lat,lon),
    radius: radius,
    types: ['liquor_store']
  };

  Places.nearbySearch(request, createMarker);

  if (circles.length == 0) {
    console.log("finished loading pins");
  }
  else{
    setTimeout(function(){findPlaces(circles,radius)},350);
    };
  }

  function createMarker(results, status) {
    console.log(status);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var point = results[i];

      lat = point.geometry.location.mb;
      lon = point.geometry.location.nb;

      marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lon)
      });

      drawMarker(marker);
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
          Places.getDetails(point, function(result, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
            }
          infoWindow.setContent(result.name);
          infoWindow.open(map, marker);
        });
      });
      }
    }
  };
