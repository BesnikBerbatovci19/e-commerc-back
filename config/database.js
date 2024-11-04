// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "127.0.0.1",
//   database: "ecommerc",
//   user: "root",
//   password: "",
// });

// module.exports = connection;
const mysql = require("mysql2");
const fs = require("fs");

const path = require("path");
const caCertPath = path.join(__dirname, "../config/ca-certificate.crt");

const caCert = fs.readFileSync(caCertPath);
const connection = mysql.createConnection({
  host: "gorilla-mall-do-user-9319410-0.d.db.ondigitalocean.com",
  user: "doadmin",
  password: "AVNS_1Xl9WCWG0y6UxKBAQb5",
  database: "ecommerc",
  port: 25060,
  ssl: {
    ca: caCert,
  },
});

module.exports = connection;
