 'use strict';

 function getForecastFromNetwork() {
  return fetch(`/forecast/`)
  .then((response) => {
        //response.json().then((res)=> console.log(res));
        // console.log("Dans getForecastFromNetwork !");
        //console.log(response.json().then((res)=>(res)));
        return response.json();
      })
  .catch((err) => {
    console.error('FETCH Error:', err.message);
    return null;
  });
}

 function getForecastSearchFromNetwork() {
  return fetch(`/forecastSearch/`)
  .then((response) => {
        //response.json().then((res)=> console.log(res));
        // console.log("Dans getForecastFromNetwork !");
        //console.log(response.json().then((res)=>(res)));
        return response.json();
      })
  .catch((err) => {
    console.error('FETCH Error:', err.message);
    return null;
  });
}

 function getForecastFromCache(coords) {
  // CODELAB: Add code to get weather forecast from the caches object.
  if (!('caches' in window)) {
    return null;
  }
  const url = `${window.location.origin}/forecast/${coords}`;
  return caches.match(url)
  .then((response) => {
    if (response) {
      return response.json();
    }
    return null;
  })
  .catch((err) => {
    console.error('Error getting data from cache', err);
    return null;
  });
}

 function updateData() {
  
}

 function init() {
  // Update the UI.
  updateData();
  var stops = getForecastFromNetwork();
  //stops = stops.then((res) => console.log(res.json()))
  //.catch((rej) => console.log(rej));
  //stops = JSON.stringify(stops);
  /*Leton code*/
  document.getElementById("TEST").innerHTML="dsf";
  document.getElementById("TEST").innerHTML=Object.values(stops);


  /*Aliak code*/

  var map = L.map('map', {
    center: [[40.775,-73.972]],
    scrollWheelZoom: false,
    inertia: true,
    inertiaDeceleration: 2000
  });
  map.setView([40.775,-73.972], 15);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
    maxZoom: 15,
    id: 'superpikar.n28afi10',
    accessToken: 'pk.eyJ1IjoiZGFya2FiIiwiYSI6ImNqd3VueXl3dzAyYW00OXBuaXQ5bGZ2MzkifQ.AZUSWLccliPlhNMClrwW5w'
  }).addTo(map);

  $(document).ready(function() {
    map.locate({setView: true, maxZoom: 15});
    getForecastFromNetwork()
    .then(res => {
      res.stops.forEach(
        function (elem) {
          L.marker({lat : elem.latitude, lng: elem.longitude}).addTo(map)
          .on('click', function(){
            confirm(elem.short_name);
          });
        })
    })
    .catch(err => console.error(err))


        // console.log(data);
  });
  var coor = "";
  function onLocationFound(e) {
    var radius = e.accuracy / 2;
    coor = e.latlng;
    L.marker(e.latlng).addTo(map)
    .on('click', function(){
      confirm("Ton emplacement");
    });
    //.bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
  }

  map.on('locationfound', onLocationFound);

  function onLocationError(e) {
    alert(e.message);
  }
  map.on('locationerror', onLocationError);

  getForecastSearchFromNetwork()
    .then((res) => console.log(res))

}

init();
