'use strict';

const sqldb = rootRequire('sqldb');
const _ = require('lodash');
const Q = require('q');
const utils = require('../utils');
const PFManagerBroadcaster = sqldb.PFManagerBroadcaster;

/**
 * Show PFManagerBroadcaster List
 *
 * @param req
 * @param res
 */
module.exports.index = function (req, res) {
  return PFManagerBroadcaster.findAll({
    attributes: [
      '_id',
      'name',
      'capabilities'
    ]
  })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

/**
 * Show PFProvider informations
 *
 * @param req
 * @param res
 */
module.exports.show = function (req, res) {
  let queryOptions = {
    where: {
      _id: req.params.id
    }
  };

  PFManagerBroadcaster.find(queryOptions)
    .then(utils.handleEntityNotFound(res))
    .then(utils.responseWithResult(req, res))
    .catch(res.handleError());
};

/**
 * Creates a new PFProvider in the DB
 *
 * @param req
 * @param res
 */
module.exports.create = (req, res) => {

  Q()
    .then(() => {
      return PFManagerBroadcaster.sync();
    })
    .then(() => {
      return PFManagerBroadcaster.create(req.body);
    })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

/**
 * Updates a PFProvider in the DB
 *
 * @param req
 * @param res
 */
exports.update = (req, res) => {

  PFManagerBroadcaster.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then((entity) => {
      const mergedData = _.merge(entity.toJSON(), req.body);
      return entity.updateAttributes(mergedData);
    })
    .then(utils.responseWithResult(req, res))
    .catch(res.handleError());
};


/**
 * Delete a PFProvider in the DB
 *
 * @param req
 * @param res
 */

exports.destroy = (req, res) => {
  PFManagerBroadcaster.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.removeEntity(res))
    .catch(res.handleError());
};
