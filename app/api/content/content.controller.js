'use strict';

const sqldb = rootRequire('sqldb');
const Q = require('q');
const utils = require('../utils');
const PFManagerContent = sqldb.PFManagerContent;
const PFManagerBroadcaster = sqldb.PFManagerBroadcaster;
const PFManagerJob = sqldb.PFManagerJob;
const mediainfo = require('mediainfoq');
/**
 * Show PFManagerContent List
 *
 * @param req
 * @param res
 */
module.exports.index = function (req, res) {
  return PFManagerContent.findAll({
    include: [
      {
        model: PFManagerBroadcaster,
        as: 'broadcasters',
        required: false,
        attributes: ['_id', 'name']
      },
      {
        model: PFManagerJob,
        as: 'jobs',
        required: false,
        attributes: ['_id', 'status', 'progress', 'encodingId']
      }
    ]
  })
    .then(utils.responseWithResult(req, res, 201))
    .catch(res.handleError());
};

/**
 * Show MediaInfo Metatdata
 *
 * @param req
 * @param res
 */
module.exports.mediaInfo = function (req, res) {
  Q()
    .then(() => {
      const {
        url,
        //username,
        //password,
        //formUrl,
        //isSaving
      } = req.query;

      return mediainfo(url);
    })
    .then(mediaInfo => {
      if (!mediaInfo || !mediaInfo.length) {
        throw new Error('No media info found from source');
      }

      return mediaInfo[0];
    })
    .then(
      res.json.bind(res),
      err => {
        console.error(err.message);
        res.status(500).json({
          error: err.message
        });
      }
    );
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
    include: [
      {
        model: PFManagerBroadcaster,
        as: 'broadcasters',
        required: false,
        attributes: ['_id', 'name']
      },
      {
        model: PFManagerJob,
        as: 'jobs',
        required: false,
        attributes: ['_id', 'status', 'progress', 'encodingId']
      }
    ]
  };

  PFManagerContent.find(queryOptions)
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
    storageUrl
  } = req.body;

  let c = {
    entity: null
  };

  Q()
    .then(() => {
      return PFManagerContent.create({
        contentType: 'url',
        contentUrl: storageUrl,
        contentId
      });
    })
    .then((entity) => {
      c.entity = entity;
      console.log('[CLIENT PF]: fetch media info ', storageUrl);
      return mediainfo(storageUrl);
    })
    .then(mediaInfo => {
      if (!mediaInfo || !mediaInfo.length) {
        throw new Error('No media info found from source');
      }

      c.entity.mediaInfo = mediaInfo[0];
      return c.entity.save();
    })
    .then(utils.addBroadcasters(req.body))
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

  PFManagerContent.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.addBroadcasters(req.body))
    .then((entity) => {
      return entity.updateAttributes(req.body);
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
  PFManagerContent.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.removeEntity(res))
    .catch(res.handleError());
};
