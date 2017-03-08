'use strict';

const express = require('express');
const controller = require('./provider.controller.js');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/status', controller.status);
router.get('/:id/presets', controller.presets);

module.exports = router;
