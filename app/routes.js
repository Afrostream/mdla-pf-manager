'use strict';

const express = require('express');
const router = express.Router();

// all routes are no-cache
router.use((req, res, next) => {
  res.noCache();
  next();
});
// opening routes
router.use('/api/contents', require('./api/content'));
router.use('/api/broadcasters', require('./api/broadcaster'));
router.use('/api/providers', require('./api/provider'));
router.use('/api/jobs', require('./api/job'));

router.get('/*', require('./app.controller').index);

module.exports = router;
