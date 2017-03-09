'use strict';

const Q = require('q');
const utils = require('../utils');
const PFManager = rootRequire('components/manager');

/**
 * List All PFManager
 *
 * @param req
 * @param res
 */
module.exports.index = (req, res) => {
  Q()
    .then(() => {
      return PFManager.showAll();
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
module.exports.show = (req, res) => {
  Q()
    .then(() => {
      return PFManager.getProviderByName(req.params.id);
    })
    .then((provider) => {
      return provider.infos();
    })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

module.exports.status = (req, res) => {

  Q()
    .then(() => {
      return PFManager.getProviderByName(req.params.id);
    })
    .then((provider) => {
      return provider.healthCheck();
    })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

module.exports.presets = (req, res) => {

  Q()
    .then(() => {
      return PFManager.getProviderByName(req.params.id);
    })
    .then((provider) => {
      return provider.presets();
    })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

module.exports.jobsList = (req, res) => {

  Q()
    .then(() => {
      return PFManager.getProviderByName(req.params.id);
    })
    .then((provider) => {
      return provider.jobsList();
    })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};