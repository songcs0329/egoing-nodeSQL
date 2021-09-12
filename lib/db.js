var mysql = require('mysql');
var dbTemplate = require('./db.template');
var db = mysql.createConnection(dbTemplate);
db.connect();

module.exports = db;