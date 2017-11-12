var path = require('path');
var http = require('http');
var express = require('express');
var proxyMiddleware = require('http-proxy-middleware')
var app = express();
// default port where dev server listens for incoming traffic
var port = 1316;
const URL = 'http://api.alphagoo.cn'
const proxyTable = {
    '/v1': {
        target: URL,
        secure: false,
        // 新增一行
        changeOrigin: true,
        // pathRewrite: {'^/v1': ''}
    },
    '/v1*': {
        target: URL,
        secure: false,
        changeOrigin: true
    },
    '/user/*': {
        target: URL,
        secure: false,
        changeOrigin: true
    },
    '/images/*': {
        target: URL,
        secure: false,
        changeOrigin: true
    },
    '/images/users/(.*)/avatar/*': {
        target: URL,
        secure: false,
        changeOrigin: true
    },
    '/socket.io/*': {
        target: URL,
        secure: false,
        changeOrigin: true
    }
};

var routes = express.Router();
routes.get('/', function (req, res, next) {
    req.url = '/index.html';
    next();
});

app.use(routes);
// serve pure static assets
app.use(express.static('./dist'))

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
  });

console.log('> Starting dev server...')

console.log('> Listening at ' + port + '\n')

var server = app.listen(port)