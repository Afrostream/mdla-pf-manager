'use strict';

const express = require('express');
const controller = require('./job.controller.js');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id/status', controller.pfStatus);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
