const mysql = require('mysql');
const config = require('../config/pathsetting')

const connection = mysql.createConnection({
    host: config.mysql_host,
    user: config.mysql_user,
    password: config.mysql_password,
    database: config.mysql_database
});

connection.connect();

module.exports = {
    connection
};
