'use strict';

const express = require('express');
const fetch = require('node-fetch');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
// CODELAB: Change this to add a delay (ms) before the server responds.
const FORECAST_DELAY = 0;
// LETON: Les constantes de l'api OUIBUS
const ouibus = require('ouibus');
const OUIBUS_API_KEY = "Token 4-SSgAE5flA_cP8pVY6oUA";
const OUIBUS_BASE_URL = "https://api.idbus.com/v1";

/**
 * Forecast des stops 
 */
function getForecast(req, resp) {
  const url = `${OUIBUS_BASE_URL}/stops`;
  fetch(url,{ method: 'get',
    headers: {'Authorization': OUIBUS_API_KEY}
  }).then((resp) => {
    return(resp.json());
  }).then((data) => {
    setTimeout(() => {
      resp.json(data);
    }, FORECAST_DELAY);
  }).catch((err) => {
    console.error('OUIBUS API Error:', err.message);
    return null;
  });
}

/**
 * Forecast des search 
 */
function getForecastSearch(req, resp) {
  const origin_id = req.params.origin_id || 1;
  const destination_id = req.params.destination_id || 5;
  const date = req.params.date || "2019-09-01";
  
  const url = `${OUIBUS_BASE_URL}/search`;
  const params = new URLSearchParams();
  params.append('origin_id', origin_id);
  params.append('destination_id', destination_id);
  params.append('date', date);

  fetch(url,{ method: 'post', 
              headers: {'Authorization': OUIBUS_API_KEY},
              body: params
  }).then((resp) => {
    return(resp.json());
  }).then((data) => {
    setTimeout(() => {
      resp.json(data);
    }, FORECAST_DELAY);
  }).catch((err) => {
    console.error('OUIBUS API Error:', err.message);
    return null;
  });
}

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
  const app = express();

  // Redirect HTTP to HTTPS,
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  // Logging for each request
  app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    // eslint-disable-next-line no-console
    console.log(m);
    next();
  });

  // Handle requests for the stops
  app.get('/forecast/:location', getForecast);
  app.get('/forecast/', getForecast);
  app.get('/forecast', getForecast)
  ;
  // Handle requests for the search
  app.get('/forecastSearch/:string', getForecastSearch);
  app.get('/forecastSearch/', getForecastSearch);
  app.get('/forecastSearch', getForecastSearch);

  // Handle requests for static files
  app.use(express.static('public'));

  // Start the server
  return app.listen('8000', () => {
    // eslint-disable-next-line no-console
    console.log('Local DevServer Started on port 8000...');
  });
}

startServer();



/*-------- Rappel des test : AREA--------

Pour les stops:
___________________________________________
const ouibus = require('ouibus');
const OUIBUS_API_KEY = "Token 4-SSgAE5flA_cP8pVY6oUA";
const OUIBUS_BASE_URL = "https://api.idbus.com/v1";
const url = `${OUIBUS_BASE_URL}/stops`;
//console.log(url);

fetch(url,{ method: 'get',
  headers: {'Authorization': OUIBUS_API_KEY}
}).then((resp) => {
  console.log(resp.json());
}).catch((err) => {
  console.error('OUIBUS API Error:', err.message);
});
___________________________________________

Pour les search:
___________________________________________
const ouibus = require('ouibus');
const OUIBUS_API_KEY = "Token 4-SSgAE5flA_cP8pVY6oUA";
const OUIBUS_BASE_URL = "https://api.idbus.com/v1";
const url = `${OUIBUS_BASE_URL}/search`;

const params = new URLSearchParams();
params.append('origin_id', 1);
params.append('destination_id', 5);
params.append('date', "2019-09-01");

fetch(url,{ method: 'post', 
            headers: {'Authorization': OUIBUS_API_KEY},
            body: params
}).then((resp) => {
  console.log("resp.json(): ");
  console.log(resp.json());
}).catch((err) => {
  console.error('OUIBUS API Error:', err.message);
});
___________________________________________
--------AREA--------*/