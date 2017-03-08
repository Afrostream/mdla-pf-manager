'use strict';

const sqldb = rootRequire('sqldb');
const _ = require('lodash');
const Q = require('q');
const utils = require('../utils');
const PFManagerBroadcaster = sqldb.PFManagerBroadcaster;
const PFManagerContent = sqldb.PFManagerContent;
const PFManagerJob = sqldb.PFManagerJob;
const PFManager = rootRequire('components/manager');
/**
 * List All PF Jobs
 *
 * @param req
 * @param res
 */
module.exports.index = function (req, res) {
  const queryOptions = {
    limit: req.query.limit || 150,
    order: [
      ['_id', 'desc']
    ]
  };
  return PFManagerJob.findAll(queryOptions)
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

  PFManagerJob.find(queryOptions)
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
  const {
    contentId,
  } = req.body;

  let message = {
    type: PFManager.MESSAGES.JOB_CREATED
  };

  Q()
    .then(() => {
    })
    .then(() => {
      return PFManagerContent.find({
        where: {
          _id: contentId
        },
        include: [
          {
            model: PFManagerBroadcaster,
            as: 'broadcasters',
            required: false,
            attributes: ['_id', 'name']
          }
        ]
      });
    })
    .then((content) => {
      if (!content) {
        throw new Error('No content Found');
      }

      //set broadcasters list in message
      message = _.merge(message, {
        data: {
          dataValues: {
            contentId: content._id,
            broadcasters: _.map(content.broadcasters || [], 'name')
          }
        }
      });

      return PFManagerJob.create(req.body);
    })
    .then((job) => {
      console.log('[PF JOB]: [AFTERCREATE]: send ' + JSON.stringify(message) + ' to mq');
      message = _.merge(message, {
        data: {
          dataValues: {
            jobId: job._id
          }
        }
      });

      PFManager.sendMessage(message);

      return job;
    })
    .then(utils.responseWithResult(req, res))
    .catch(res.handleError());
};

/**
 * Updates a PFProvider in the DB
 *
 * @param req
 * @param res
 */
exports.update = (req, res) => {

  PFManagerJob.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.saveUpdates(req.body))
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
  PFManagerJob.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.removeEntity(res))
    .catch(res.handleError());
};
