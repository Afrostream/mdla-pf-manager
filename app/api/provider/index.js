'use strict';

const express = require('express');
const controller = require('./provider.controller.js');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/status', controller.status);
router.get('/:id/presets', controller.presets);
router.get('/:id/jobs', controller.jobsList);

module.exports = router;
