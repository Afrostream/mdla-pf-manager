'use strict';

const config = rootRequire('config');
const app = require('./app');

app.listen(config.port, config.ip, function () {
  console.log(`Express server listening on ${config.port} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
