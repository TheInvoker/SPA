var express = require('express');
var path = require('path');
var transpiler = require("./../Transpiler/transpile.js");

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

// watch and transpile
var instance = new transpiler(["src"], ["public"], function(filepath) {
    var p = path.relative("src", filepath);
    var np = path.join("public", p);
    return np;
}, "/* header */", false, false, false, false, ["scss_lib"]);