var express = require('express');
var path = require('path');

// start express module
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

/**
 *  Home page http request handler.
 */

app.get('/foo', function(req, res) {
	res.header('Content-Type', "text/html; charset=utf-8");
	res.sendFile(path.join(__dirname, 'public/foo.html'));
});

app.get('/bar', function(req, res) {
	res.header('Content-Type', "text/html; charset=utf-8");
	res.sendFile(path.join(__dirname, 'public/foo.html'));
});

// start the server
var server = app.listen(process.env.PORT || 3000, function () {
	console.log("Server started...");
});