'use strict';

const express = require('express');
const controller = require('./broadcaster.controller.js');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/', controller.create);

module.exports = router;
