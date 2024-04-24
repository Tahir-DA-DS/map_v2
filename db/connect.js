const mysql = require("mysql2")
require("dotenv").config()


const pool = mysql.createPool({
    host: process.env.HOST, // IP address of the MySQL server
    user: process.env.USER, // The MySQL user to authenticate as
    password: process.env.PASS, // The password of that MySQL user
    database: process.env.DB// The database to use
}).promise()

module.exports = pool