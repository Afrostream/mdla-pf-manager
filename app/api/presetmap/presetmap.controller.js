'use strict';

const {
  PFManagerPresetMap
} = rootRequire('sqldb');
const utils = require('../utils');

const getIncludedModels = [];

/**
 * List All PFManagerPresetMap
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
  return PFManagerPresetMap.findAll(queryOptions)
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
    },
    include: getIncludedModels
  };

  PFManagerPresetMap.find(queryOptions)
    .then(utils.handleEntityNotFound(res))
    .then(utils.responseWithResult(req, res))
    .catch(res.handleError());
};
