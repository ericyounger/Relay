/* eslint-disable no-undef */
const mysql = require("mysql");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 4000;
require("dotenv").config();


var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	port: process.env.DB_PORTNR,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE_NAME,
	socketPath: process.env.DB_SOCKETPATH
});
  
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected to database!");
});

app.use(express.json());
app.use(cors());

app.get("/files/:fileId", (req, res) => {
	console.log("Request to GET files with id " + req.params.fileId);

	//TODO: FIX SQL INJECTION, USE PREPARE STATEMENTS INSTEAD
	const uuid = req.params.fileId;
	con.query("select * from file where uuid=?", [uuid], function (error, results, fields) {
		if (error) throw error;
		res.send(results);
	});
});

app.post("/files", (req, res) => {
	console.log("Request to POST file");
	//TODO: FIX SQL INJECTION, USE PREPARE STATEMENTS INSTEAD
	const json = req.body;
	con.query("insert into file(uuid, magnet) values(?, ?)", [json.uuid, json.magnet], function (error, results, fields) {
		if (error) throw error;
		res.send(results);
	});

});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
