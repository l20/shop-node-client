var path = require('path');
var http = require('http');
var express = require('express');
var app = express();
// default port where dev server listens for incoming traffic
var port = 1316;
const URL = 'http://api.alphagoo.cn'

var routes = express.Router();
routes.get('/', function (req, res, next) {
    req.url = '/index.html';
    next();
});

app.use(routes);
// serve pure static assets
app.use(express.static('./dist'))

console.log('> Starting dev server...')

console.log('> Listening at ' + port + '\n')

var server = app.listen(port)