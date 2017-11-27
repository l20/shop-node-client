var path = require('path');
var http = require('http');
var express = require('express');
var compression = require('compression');
var history = require('connect-history-api-fallback');
var proxyMiddleware = require('http-proxy-middleware');
var app = express();
// default port where dev server listens for incoming traffic
var port = 1316;
// const URL = 'http://api.alphagoo.cn';
const URL = 'http://localhost:1314';
const proxy = {
    target: URL,
    // secure: false,
    // 新增一行
    // changeOrigin: true,
    // pathRewrite: {'^/v1': ''}
};

const proxyTable = {
    '/v1': proxy,
    '/v1*': proxy,
    '/user/*': proxy,
    '/images/*': proxy,
    '/socket.io/*': proxy,
    '/images/users/(.*)/avatar/*': proxy
};

var routes = express.Router();
routes.get('/', function (req, res, next) {
    req.url = '/index.html';
    next();
});
// server gizp
app.use(compression());
// router
app.use(routes);
// route history 
app.use(history());
history({
    index: './404.html'
});

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