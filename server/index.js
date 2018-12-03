const express = require('express');
const app = express();

var ttn = require("ttn");
var mysql = require("mysql");

//Get credentials
var options = require('./options');

var appID = options.storageConfig.appID;
var accessKey = options.storageConfig.accessKey;

var hexPayload; //distance to water (hex)
var distance; //distance to water in mm

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
