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
  //let queryOptions = {
  //  where: {
  //    _id: req.params.id,
  //  },
  //  include: [
  //    {
  //      model: PFBroadcaster,
  //      as: 'broadcasters',
  //      required: false,
  //      attributes: ['_id', 'name']
  //    }
  //  ]
  //};
  //
  //PFProvider.find(queryOptions)
  //  .then(utils.handleEntityNotFound(res))
  //  .then(utils.responseWithResult(req, res))
  //  .catch(res.handleError());
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

///**
// * Creates a new PFProvider in the DB
// *
// * @param req
// * @param res
// */
//module.exports.create = (req, res) => {
//  PFProvider.create(req.body)
//    .then(utils.addBroadcasters(req.body))
//    .then(utils.responseWithResult(req, res, 201))
//    .catch(res.handleError());
//};
//
///**
// * Updates a PFProvider in the DB
// *
// * @param req
// * @param res
// */
//exports.update = (req, res) => {
//
//  PFProvider.find({
//    where: {
//      _id: req.params.id
//    }
//  })
//    .then(utils.handleEntityNotFound(res))
//    .then(utils.saveUpdates(req.body))
//    .then(utils.addBroadcasters(req.body))
//    .then(utils.responseWithResult(req, res))
//    .catch(res.handleError());
//};
//
//
///**
// * Delete a PFProvider in the DB
// *
// * @param req
// * @param res
// */
//
//exports.destroy = (req, res) => {
//  PFProvider.find({
//    where: {
//      _id: req.params.id
//    }
//  })
//    .then(utils.handleEntityNotFound(res))
//    .then(utils.removeEntity(res))
//    .catch(res.handleError());
//};
