module.exports = {
  //Connect to a database and return the connection
  getDbConnecton: function(h, u, p) {
    var mysql = require("mysql");
    var conn = mysql.createConnection({
      host: h,
      user: u,
      password: p
    });

    //Make sure there is a connection to the database
    conn.connect(function(err) {
      if (err) throw err;
    });

    //Return the connection
    return conn;
  }
}
