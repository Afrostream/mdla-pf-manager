'use strict';

const express = require('express');
const AfrostreamNodeApp = require('afrostream-node-app');
const config = rootRequire('config');
const routes = require('./routes.js');
var middlewareError = require('./middlewares/middleware-error.js');
const afrostreamMiddlewareError = require('afrostream-node-middleware-error');

const fs = require('fs');
const serveIndex = require('serve-index');

const {basicAuth} = config;

const app = AfrostreamNodeApp.create({basicAuth: basicAuth, views: __dirname + '/views'});
//  to present res.handleError()
app.use(middlewareError());
//
try {
  fs.mkdirSync(config.delivery);
} catch (err) {
  console.error('[WARNING]: cannot create /tmp/delivery (' + err.message + ')');
}
app.use('/delivery', serveIndex(config.delivery, {'icons': true}));
app.use('/delivery', express.static(config.delivery));
//
app.use(routes);
//
// hotfix: creating a "error middleware"
app.use(afrostreamMiddlewareError);
//
module.exports = app;
