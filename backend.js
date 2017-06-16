var utils = require('./utils.js');
var express = require('express');
var app = express();
var http = require('http');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var count = 0;
app.get('/api/:word',utils);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

// lineBreak()

