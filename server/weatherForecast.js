const request = require('request-promise');

const apiKey = "f00ff11eb57305792f4376732d366dde";

module.exports = {
  getCurrentRainData: function(lat, lon) {
    let rainData = [];
    return request("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&APPID="+ apiKey, { json: true })
      .then(function(body) {
        body.list.forEach(forecast => {
          // some forecasts don't have rain predictions
          if(Object.keys(forecast.rain).length !== 0) {
            rainData.push(forecast.rain["3h"]);
          }
        });
        return rainData;
      })
      .catch((err) => setImmediate(() => {
        throw err;
      }));
  }
}
