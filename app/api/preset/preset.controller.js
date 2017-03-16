'use strict';

const {
  PFManagerPreset,
  PFManagerAudioStreamConfig,
  PFManagerVideoStreamConfig,
  PFManagerPresetMap
} = rootRequire('sqldb');
const utils = require('../utils');
const _ = require('lodash');
const Q = require('q');
const PFManager = rootRequire('components/manager');

const getIncludedModels = [
  {
    model: PFManagerVideoStreamConfig,
    as: 'videoStreamConfig',
    required: false
  },
  {
    model: PFManagerAudioStreamConfig,
    as: 'audioStreamConfig',
    required: false
  },
  {
    model: PFManagerPresetMap,
    as: 'mapProvidersPresets',
    required: false
  }
];

const sendPresetMessage = (preset, message) => {
  return Q()
    .then(() => {
      console.log(`[PF PRESET]: [AFTERCREATE]: preset : ${preset._id} send ${message.type} to mq`);
      message = _.merge(message, {
        data: {
          dataValues: _.merge(preset.toJSON(), {
            presetName: preset.name,
            presetId: preset._id
          })
        }
      });
      return PFManager.sendMessage(message);
    })
    .then(() => {
      return message;
    });
};

const addVideoConfig = (updates) => {
  const config = PFManagerVideoStreamConfig.build(updates.videoStreamConfig);
  return entity => entity.setVideoStreamConfig(config)
    .then(() => entity);
};

const addAudioConfig = (updates) => {
  const config = PFManagerAudioStreamConfig.build(updates.audioStreamConfig);
  return entity => entity.setAudioStreamConfig(config)
    .then(() => entity);
};

/**
 * List All PFProviders
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
  return PFManagerPreset.findAll(queryOptions)
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

  PFManagerPreset.find(queryOptions)
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

  let c = {
    preset: null,
    message: {
      type: PFManager.MESSAGES.PRESET.CREATE
    }
  };

  Q()
    .then(() => {
      const insert = _.merge(req.body, {status: PFManager.STATUS.PRESET.PENDING});
      return PFManagerPreset.create(insert);
    })
    .then(addVideoConfig(req.body))
    .then(addAudioConfig(req.body))
    .then((preset) => {
      return PFManagerPreset.find({
        where: {
          _id: preset._id
        },
        include: getIncludedModels
      });
    })
    .then(utils.handleEntityNotFound(res))
    .then((preset) => {
      c.preset = preset;
      return sendPresetMessage(c.preset, c.message);
    })
    .then(() => {
      return c.preset;
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

  PFManagerPreset.find({
    where: {
      _id: req.params.id
    },
    include: getIncludedModels
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.saveUpdates(req.body))
    .then(addVideoConfig(req.body))
    .then(addAudioConfig(req.body))
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
  PFManagerPreset.find({
    where: {
      _id: req.params.id
    }
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.removeEntity(res))
    .catch(res.handleError());
};
