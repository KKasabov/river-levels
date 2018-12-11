var dbConn = require('./dbConn'); //The database connector
var options = require('./options'); //The parsed options(credentials) file
var configArr = options.storageConfig; //An array with the credentials
var conn = dbConn.getDbConnecton(configArr.host, configArr.user, configArr.pwd); //The database connection

module.exports = {
  getLatestReading: function(dev_id) {
    return new Promise(function(resolve, reject) {
      var params = [dev_id];
      var sql = "SELECT MAX(timestamp) AS timestamp, distanceToSensor FROM ni60.log WHERE dev_id = ?";
      conn.query(sql, params, function(err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  getDataForPeriod: function(dev_id, dateFrom, dateTo) {
    return new Promise(function(resolve, reject) {
      var params = [dev_id, dateFrom, dateTo];
      var sql = "SELECT timestamp, distanceToSensor FROM ni60.log WHERE dev_id = ? AND (CAST(timestamp AS DATE) BETWEEN ? AND ?)";
      conn.query(sql, params, function(err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  insertLogRecord: function(params) {
    var sql = "INSERT INTO ni60.log SET ?";
    conn.query(sql, params, function(err, result) {
      if (err) throw err;
      console.log("1 record added to the log");
    });
  },
  addSubsriber: function(params) {
    var sql = "INSERT INTO ni60.subscribers SET ?";
    conn.query(sql, params, function(err, result) {
      if (err) throw err;
      console.log("1 record added to the log");
    });
  },
  getSubscribers: function() {
    return new Promise(function(resolve, reject) {
      var sql = "SELECT latitude, longitude, county, name, email, contactNumber FROM ni60.subscribers";
      conn.query(sql, function(err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
