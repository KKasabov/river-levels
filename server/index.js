var ttn = require("ttn");

var appID = "kentwatersensors"
var accessKey = "ttn-account-v2.7j6Z9OduNwFW7il2Sd28YYF4Q-8l9rDDPaNRFw06-GM"

var hexPayload;
var distance;

ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
      hexPayload = Buffer.from(payload.payload_raw, 'base64').toString('hex');
      distance = parseInt(hexPayload, 16);
      console.log(hexPayload);
      console.log(distance);
    })
  })
  .catch(function (error) {
    console.error("Error", error)
    process.exit(1)
  })
