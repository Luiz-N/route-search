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
    // types: places.length === 0 ? nil : places
    types: places
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
      if (places === null){return;}
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
