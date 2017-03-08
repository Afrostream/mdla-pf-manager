'use strict';

const express = require('express');
const controller = require('./content.controller.js');

const router = express.Router();

router.get('/', controller.index);
router.get('/mediaInfo', controller.mediaInfo);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.post('/', controller.create);

module.exports = router;
