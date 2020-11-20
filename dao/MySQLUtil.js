const mysql = require('mysql');

const connection = mysql.createConnection({
    //GCP環境
    // host: '35.223.47.97',
    // user: 'root',
    // password: 'enabler',
    // database: 'enablermap'
    host: 'localhost',
    user: 'root',
    password: 'laotao13CV',
    database: 'enablermap'
});

connection.connect();

module.exports = {
    connection
};
