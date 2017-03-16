'use strict';

const {
  PFManagerPreset,
  PFManagerProfile
} = rootRequire('sqldb');
const utils = require('../utils');
const _ = require('lodash');

const getIncludedModels = [
  {
    model: PFManagerPreset,
    as: 'presets',
    required: false
  }
];

const addPreset = (updates) => {
  const presets = PFManagerPreset.build(_.map(updates.presets || [], _.partialRight(_.pick, '_id')));
  return entity => entity.setPresets(presets)
    .then(() => entity);
};
/**
 * List All PFManagerProfiles
 *
 * @param req
 * @param res
 */
module.exports.index = function (req, res) {
  const queryOptions = {
    limit: req.query.limit || 150,
    order: [
      ['_id', 'desc']
    ],
    include: getIncludedModels
  };
  return PFManagerProfile.findAll(queryOptions)
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

/**
 * Show PFManagerProfile informations
 *
 * @param req
 * @param res
 */
module.exports.show = function (req, res) {
  let queryOptions = {
    where: {
      _id: req.params.id
    },
    include: getIncludedModels
  };

  PFManagerProfile.find(queryOptions)
    .then(utils.handleEntityNotFound(res))
    .then(utils.responseWithResult(req, res))
    .catch(res.handleError());
};

/**
 * Creates a new PFManagerProfile in the DB
 *
 * @param req
 * @param res
 */
module.exports.create = (req, res) => {
  PFManagerProfile.create(req.body)
    .then(addPreset(req.body))
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

/**
 * Updates a PFManagerProfile in the DB
 *
 * @param req
 * @param res
 */
exports.update = (req, res) => {

  PFManagerProfile.find({
    where: {
      _id: req.params.id
    },
    include: getIncludedModels
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.saveUpdates(req.body))
    .then(addPreset(req.body))
    .then(utils.responseWithResult(req, res))
    .catch(res.handleError());
};


/**
 * Delete a PFManagerProfile in the DB
 *
 * @param req
 * @param res
 */

exports.destroy = (req, res) => {
  PFManagerProfile.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.removeEntity(res))
    .catch(res.handleError());
};
