'use strict';

const express = require('express');
const AfrostreamNodeApp = require('afrostream-node-app');
const config = rootRequire('config');
const mqPF = rootRequire('components/manager/mqPF');
const routes = require('./routes.js');
const SocketIO = require('socket.io');
const middlewareError = require('./middlewares/middleware-error.js');
const afrostreamMiddlewareError = require('afrostream-node-middleware-error');
const http = require('http');

const fs = require('fs');
const serveIndex = require('serve-index');

const {basicAuth} = config;

const app = AfrostreamNodeApp.create({basicAuth: basicAuth, views: __dirname + '/views'});
const server = http.createServer(app);
//add soket.io
const io = SocketIO(server);
//  to present res.handleError()
app.use(middlewareError());
//
try {
  fs.mkdirSync(config.delivery);
} catch (err) {
  console.error('[WARNING]: cannot create /tmp/delivery (' + err.message + ')');
}

io.on('connection', function (socket) {
  mqPF.on('message', (message) => {
    socket.emit(message.type, message.data.dataValues);
  });
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
//io.configure(function () {
//  io.set('transports', ['xhr-polling']);
//  io.set('polling duration', 10);
//});

app.use('/delivery', serveIndex(config.delivery, {'icons': true}));
app.use('/delivery', express.static(config.delivery));
//
app.use(routes);
//
// hotfix: creating a "error middleware"
app.use(afrostreamMiddlewareError);
//
module.exports = server;
