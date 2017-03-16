'use strict';

const express = require('express');
const controller = require('./presetmap.controller.js');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
