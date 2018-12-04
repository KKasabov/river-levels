const request = require('request');
const express = require('express');
//const cors = require('cors');
//dsrb = distance_sensor_from_river_bed
//dfpfrb distance_flood_plain_from_river_bed
const dsrb_f3 = 1820;
const dfpfrb_f3 = 1820;
const dsrb_45 = 1340;
const dfpfrb_45 = 1200;

const API_PORT = 8080;
const app = express();
const router = express.Router();

var ttn = require("ttn");
var mysql = require("mysql");

//Get credentials
var options = require('./options');

var appID = options.storageConfig.appID;
var accessKey = options.storageConfig.accessKey;

var hexPayload; //distance to water (hex)
var distance; //distance to water in mm
var floodAlert = false;


//the 'request' package supports HTTPS and follows redirects by default :-)
request
  .get('https://environment.data.gov.uk/flood-monitoring/id/stations/E3826/measures?parameter=level')
  // .get('https://environment.data.gov.uk/flood-monitoring/id/stations/E3826/readings?latestReading_limit=1')
  .on('response', function(response) {
    // console.log(JSON.stringify(response))
  })

var con = mysql.createConnection({
  host: options.storageConfig.host,
  user: options.storageConfig.user,
  password: options.storageConfig.pwd
});

//Make sure there is a connection to the database
con.connect(function(err) {
  if (err) throw err;
});

//receive data and add it to a database
ttn.data(appID, accessKey)
  .then(function(client) {
    client.on("uplink", function(devID, payload) {

      console.log("Received uplink from: " + devID);
      console.log(payload);
      hexPayload = Buffer.from(payload.payload_raw, 'base64').toString('hex'); //the distance in hex format
      distance = parseInt(hexPayload, 16); //the integer value (distance in mm)

      var queryData_Log = {
        timestamp: payload.timestamp,
        dev_id: payload.dev_id,
        distanceToSensor: distance
      };

      sql = "INSERT INTO ni60.log SET ?";
      con.query(sql, queryData_Log, function(err, result) {
        if (err) throw err;
        console.log("1 record added to the log");
      });
    })
  })
  .catch(function(error) {
    console.error("Error: ", error)
    process.exit(1)
  })

function getDataForPeriod(dateFrom, dateTo) {
  return new Promise((resolve, reject) => {
    params = [dateFrom, dateTo];
    sql = "SELECT timestamp, distanceToSensor FROM ni60.log WHERE CAST(timestamp AS DATE) BETWEEN ? AND ?";
    con.query(sql, params, function(err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  getDataForPeriod('2018-12-02','2018-12-03').then(function(result) {
    res.json(result);
  }).catch((err) => setImmediate(() => { throw err; })); // Throw async to escape the promise chain
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
