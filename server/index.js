const express = require('express');
const app = express();

var ttn = require("ttn");
var mysql = require("mysql");

var appID = "kentwatersensors"
var accessKey = "ttn-account-v2.7j6Z9OduNwFW7il2Sd28YYF4Q-8l9rDDPaNRFw06-GM"

var hexPayload;
var distance;

var con = mysql.createConnection({
  host: "dragon.kent.ac.uk",
  user: "ni60",
  password: "sul3lox"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("\n Connected!");
});

// var post  = {dev_id: , longitude:20.20,latitude:20.20,altitude:20};
// var query = con.query('INSERT INTO ni60.sensors SET ?', post, function (error, results, fields) {
  // if (error) throw error;
  // Neat!
  // console.log("1 record inserted");

// });
// var sql = "INSERT INTO ni60.sensors('dev_id','latitude',`longitude','altitude') VALUES (?,?,?,?)";
// con.query(sql, queryData,function (err, result) {
//   if (err) throw err;
//   console.log("1 record inserted");
// });


// var payload_offline={dev_id:123,payload_raw:}
//
// var queryData_Log={dev_id:'kur',distanceToSensor:1390}
// sql = "INSERT INTO ni60.log SET ?";
// con.query(sql, queryData_Log,function (err, result) {
//   if (err) throw err;
//   console.log("1 record inserted in the log");
// });

//
// var queryData_Log={
//   dev_id:'lairdc0ee4000010109f3',
//   distanceToSensor:1309};
// sql = "INSERT INTO ni60.log SET ?";
// con.query(sql, queryData_Log,function (err, result) {
//   if (err) throw err;
//   console.log("1 record inserted in the log");
// });
//

ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID);
      console.log(payload.metadata.latitude);
      hexPayload = Buffer.from(payload.payload_raw, 'base64').toString('hex');

      var queryData={
        dev_id:payload.dev_id,
        latitude: payload.metadata.latitude,
        longitude: payload.metadata.longitude,
        altitude: payload.metadata.altitude
      };

      var sql = "INSERT INTO ni60.sensors SET ? ON DUPLICATE KEY UPDATE";
      con.query(sql, queryData,function (err, result) {
        if (err) throw err;
      });
      console.log("1 record inserted in sensors table");

      distance = parseInt(hexPayload, 16);
      console.log(hexPayload);
      console.log(distance);

      var queryData_Log={
        dev_id:payload.dev_id,
        distanceToSensor:distance};
      sql = "INSERT INTO ni60.log SET ?";
      con.query(sql, queryData_Log,function (err, result) {
        if (err) throw err;
        console.log("1 record inserted in the log");
      });
    })
  })
  .catch(function (error) {
    console.error("Error", error)
    process.exit(1)
  })
