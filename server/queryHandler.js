var dbConn = require('./dbConn'); //The database connector
var options = require('./options'); //The parsed options(credentials) file
var configArr = options.storageConfig; //An array with the credentials
var conn = dbConn.getDbConnecton(configArr.host, configArr.user, configArr.pwd); //The database connection

module.exports = {
  getDataForPeriod: function(dateFrom, dateTo) {
    var params = [dateFrom, dateTo];
    sql = "SELECT timestamp, distanceToSensor FROM ni60.log WHERE CAST(timestamp AS DATE) BETWEEN ? AND ?";
    conn.query(sql, params, function(err, result) {
      if (err) throw err;
      return result;
    });
  },
  insertLogRecord: function(params) {
    sql = "INSERT INTO ni60.log SET ?";
    conn.query(sql, params, function(err, result) {
      if (err) throw err;
      console.log("1 record added to the log");
    });
  }
}
