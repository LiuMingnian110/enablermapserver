const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'laotao13CV',
    database: 'enablermap'
});

connection.connect();

module.exports = {
    connection
};