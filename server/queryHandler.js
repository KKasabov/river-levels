var dbConn = require('./dbConn'); //The database connector
var options = require('./options'); //The parsed options(credentials) file
var configArr = options.storageConfig; //An array with the credentials
var conn = dbConn.getDbConnecton(configArr.host, configArr.user, configArr.pwd); //The database connection

module.exports = {
  getDataForPeriod: function(dateFrom, dateTo) {
    return new Promise(function(resolve, reject) {
      var params = [dateFrom, dateTo];
      var sql = "SELECT timestamp, distanceToSensor FROM ni60.log WHERE CAST(timestamp AS DATE) BETWEEN ? AND ?";
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
  }
}
