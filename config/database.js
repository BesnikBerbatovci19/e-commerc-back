const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    database: 'ecommerc',
    user: 'root',
    password: ""
});


module.exports = connection
