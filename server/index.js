// const request = require('request');
const request = require('request-promise');
const express = require('express');
const app = express();
const API_PORT = 8080;
const router = express.Router();
const sensor_f3 = "lairdc0ee4000010109f3"; //The sensor with id 'lairdc0ee4000010109f3'
const distance_sensor_from_river_bed_sensor_f3 = 1820;
const distance_flood_plain_from_river_bed_sensor_f3 = 1820;
const sensor_45 = "lairdc0ee400001012345"; //The sensor with id 'lairdc0ee400001012345'
const distance_sensor_from_river_bed_sensor_45 = 1340;
const distance_flood_plain_from_river_bed_sensor_45 = 1200;

var ttn = require("ttn");
var queryHandler = require('./queryHandler');

var options = require('./options'); //The parsed options file
var appID = options.storageConfig.appID;
var accessKey = options.storageConfig.accessKey;

var hexPayload; //distance to water (hex)
var distance; //distance to water in mm
var floodAlert = false;

var geoLib = require('geo-lib'); //A library which helps with coordinates calculations

/**
 * Returns the closest n (noOfResults) stations of a given type (sensorType
 * ("level" for water level stations
 *  "rainfall" for rainfall stations))
 * within a given radius (in km) of a given point on a map's coordinates (latitude,longitude)
 * NB: the 'request' package supports HTTPS and follows redirects by default :-)
 *
 * @param  {long} latitude      Geographical latitude
 * @param  {long} longitude     Geographical longitude
 * @param  {int} radius         The radius to look for sensors in
 * @param  {String} sensorType  The type of the sensor - level /rainfall)
 * @param  {int} noOfResults    The requested number of closest stations
 * @return {array}              The closest n stations
 */
function getNearestGovStations(latitude, longitude, radius, sensorType, noOfResults) {
  request
    .get('https://environment.data.gov.uk/flood-monitoring/id/stations/?lat=' + latitude + '&long=' + longitude + '&dist=' + radius)
    .on('data', function(data) {
      var sensors = JSON.parse(data).items;
      var locationsMap = {};
      for (var i = 0; i < sensors.length; i++) {
        if (sensors[i].measures[0].parameter == sensorType) {
          locationsMap[sensors[i].notation] = locationsMap[sensors[i].notation] || [];
          locationsMap[sensors[i].notation].push(sensors[i].lat, sensors[i].long);
        }
      }
      var distancesMap = {};
      Object.keys(locationsMap).forEach(function(key) {
        var result = geoLib.distance([
          [latitude, longitude],
          [locationsMap[key][0], locationsMap[key][1]]
        ]);
        distancesMap[key] = distancesMap[key] || [];
        distancesMap[key].push(result.distance);
      });
      var sortedDistances = [];
      for (var distance in distancesMap) {
        sortedDistances.push([distance, distancesMap[distance]]);
      }
      sortedDistances.sort(function(a, b) {
        return a[1] - b[1];
      });
      var closest = [];
      for (var i = 0; i < sortedDistances.length; i++) {
        closest.push(sortedDistances[i][0]);
      }
      return closest.slice(0, noOfResults);
    })
}
//NOTE EXAMPLE:

getNearestGovStations('51.280233', '1.0789089', 5, 'level', 2);
//receive data and add it to a database
ttn.data(appID, accessKey)
  .then(function(client) {
    client.on("uplink", function(devID, payload) {
      console.log("Received uplink from: " + devID);
      // console.log(payload);
      hexPayload = Buffer.from(payload.payload_raw, 'base64').toString('hex'); //the distance in hex format
      distance = parseInt(hexPayload, 16); //the integer value (distance in mm)

      var distance_sensor_from_river_bed;
      var distance_flood_plain_from_river_bed;

      switch (devID) {
        case sensor_45:
          distance_sensor_from_river_bed = distance_sensor_from_river_bed_sensor_45;
          distance_flood_plain_from_river_bed = distance_flood_plain_from_river_bed_sensor_45;
          break;
        case sensor_f3:
          distance_sensor_from_river_bed = distance_sensor_from_river_bed_sensor_f3;
          distance_flood_plain_from_river_bed = distance_flood_plain_from_river_bed_sensor_f3;
          break;
      }

      //TODO handle the 300mm difference
      if (distance <= distance_sensor_from_river_bed - distance_flood_plain_from_river_bed) {
        console.log('SHIIT FLOOD GET THE BOAT');
        floodAlert = true;
      } else {
        console.log('NO flood');
      }

      var params = {
        timestamp: payload.timestamp,
        dev_id: devID,
        distanceToSensor: distance
      };

      queryHandler.insertLogRecord(params);
      floodAlert = false;
    });
  })
  .catch(function(error) {
    console.error("Error: ", error);
    process.exit(1);
  })

// function to extract coordinates from polygon objects
function getPolygonData(urls) {
  let polygonCoordinates = [];
  // map all urls to async requests
  var promises = urls.map(url => request(url, { json: true }));
  // return an array of promises
  return Promise.all(promises)
    .then((data) => {
      return data;
    });
}

// this is our get method
// this method fetches all available data in our database
router.get("/getData/:deviceId/:startDate?/:endDate?", (req, res) => {
  // if start and end date have not been passed as parameters
  // then we need to return the latest reading
  let funCall = ((!req.params.startDate || !req.params.endDate)
                  ? queryHandler.getLatestReading(req.params.deviceId)
                  : queryHandler.getDataForPeriod(req.params.deviceId, req.params.startDate, req.params.endDate));
  funCall.then(function(rows) {
    res.json(rows);
  })
  .catch((err) => setImmediate(() => {
    throw err;
  }));
});

// this returns all flood areas polygon coordinates from the EA API
// *probably needs renaming*
router.get("/getAreas", (req, res) => {
  var areasURLs = []; // array to put all polygon coordinates in
  request('https://environment.data.gov.uk/flood-monitoring/id/floodAreas?lat=51.2802&long=1.0789&dist=5', { json: true })
    .then(function(body) {
      // extract polygon objects from response
      body.items.forEach(area => {
        areasURLs.push(area.polygon);
      })
      // this returns a to promise for the next then callback
      return getPolygonData(areasURLs);
    })
    .then(data => {
      // return an array of multipolygon coordinates
      res.json(data);
    })
    .catch((err) => setImmediate(() => {
      throw err;
    }));
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
