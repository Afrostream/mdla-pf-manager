'use strict';

const sqldb = rootRequire('sqldb');
const _ = require('lodash');
const Q = require('q');
const utils = require('../utils');
const PFManagerBroadcaster = sqldb.PFManagerBroadcaster;
const PFManagerContent = sqldb.PFManagerContent;
const PFManagerJob = sqldb.PFManagerJob;
const PFManager = rootRequire('components/manager');


const sendJobMessage = (job, message) => {
  return Q()
    .then(() => {
      console.log(`[PF JOB]: [AFTERCREATE]: send ${message.type} to mq`);
      message = _.merge(message, {
        data: {
          dataValues: {
            jobId: job._id,
            encodingId: job.encodingId
          }
        }
      });
      return PFManager.sendMessage(message);
    })
    .then(() => {
      return message;
    });
};

const prepareJobMessage = (contentId, message) => {
  return Q()
    .then(() => {
      console.log(`[PF JOB]: [PREPARE JOB MESSAGE]: ${message.type} for content : ${contentId}`);
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
        console.log(`[PF JOB]: [PREPARE JOB MESSAGE]: unknow content : ${contentId}`);
        throw new Error('No content Found');
      }
      //set broadcasters list in message
      message = _.merge(message, {
        data: {
          dataValues: {
            contentId: content._id,
            broadcasters: _.map(content.broadcasters || [], 'name'),
            mediaInfo: content.mediaInfo
          }
        }
      });

      return message;
    });
};
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

module.exports.pfStatus = function (req, res) {
  let queryOptions = {
    where: {
      _id: req.params.id
    }
  };

  let c = {
    job: null
  };

  return Q()
    .then(() => {
      return PFManagerJob.find(queryOptions);
    })
    .then(utils.handleEntityNotFound(res))
    .then((job) => {
      c.job = job;
      if (!job.providerName) {
        console.error(`No provider found for ${job._id}`);
        return false;
      }
      return PFManager.getProviderByName(c.job.providerName);
    })
    .then((provider) => {
      if (!provider) {
        c.message = {
          type: PFManager.MESSAGES.JOB.RESTART
        };
        return prepareJobMessage(c.job.contentId, c.message).then((message) => {
          c.message = message;
          return sendJobMessage(c.job, c.message);
        });
      }
      return provider.getStatus(c.job.encodingId);
    })
    .then(utils.responseWithResult(req, res, 201))
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

  let c = {
    job: null,
    message: {
      type: PFManager.MESSAGES.JOB.CREATE
    }
  };

  Q()
    .then(() => {
      return prepareJobMessage(contentId, c.message);
    })
    .then((message) => {
      c.message = message;
      const insert = _.merge(req.body, {status: PFManager.STATUS.JOB.PENDING});
      return PFManagerJob.create(insert);
    })
    .then((job) => {
      c.job = job;
      return sendJobMessage(c.job, c.message);
    })
    .then(() => {
      return c.job;
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

  let c = {
    job: null,
    message: {
      type: PFManager.MESSAGES.JOB.RESTART
    }
  };

  Q()
    .then(() => {
      return PFManagerJob.find({
        where: {
          _id: req.params.id
        }
      });
    })
    .then(utils.handleEntityNotFound(res))
    .then((job) => {
      c.job = job;
      return job;
    })
    .then((job) => {
      return prepareJobMessage(job.contentId, c.message);
    })
    .then((message) => {
      c.message = message;
      return c.job;
    })
    .then(utils.saveUpdates(req.body))
    .then((job) => {
      c.job = job;
      return sendJobMessage(c.job, c.message);
    })
    .then(() => {
      return c.job;
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

  let c = {
    job: null,
    message: {
      type: PFManager.MESSAGES.JOB.REMOVED
    }
  };

  return Q()
    .then(() => {
      return PFManagerJob.find({
        where: {
          _id: req.params.id
        }
      });
    })
    .then(utils.handleEntityNotFound(res))
    .then((job) => {
      c.job = job;
      return job;
    })
    .then((job) => {
      return prepareJobMessage(job.contentId, c.message);
    })
    .then((message) => {
      c.message = message;
      return sendJobMessage(c.job, c.message);
    })
    .then(() => {
      return c.job;
    })
    .then(utils.removeEntity(res))
    .catch(res.handleError());
};
