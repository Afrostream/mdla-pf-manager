'use strict';

// exporting an instance
const Q = require('q');
const config = require('./config');
const AMQP = require('afrostream-node-amqp');
const {getEntityFromType} = require('./backend.api.js');
const sqldb = rootRequire('sqldb');
const PFContent = sqldb.PFContent;
const mediainfo = require('mediainfoq');

const exchangeName = config['afrostream-back-end'].mq.exchangeName;
var mq = new AMQP(config['afrostream-back-end'].mq);
var localQueue = [];

mq.send = data => {
  try {
    mq.channel.publish(exchangeName, '', new Buffer(JSON.stringify(data)));
    console.log('send ' + JSON.stringify(data));
  } catch (e) {
    if (config.mq.displayErrors) {
      console.error('[mq-published]: send ' + e + ', stacking message');
    }
    setImmediate(() => {
      localQueue.push(JSON.parse(JSON.stringify(data)));
      // security: if the nb of standby events is too large, skip the old ones
      if (localQueue.length > 10000) {
        localQueue.shift();
      }
    });
  }
};

mq.on('message', onMessage);
mq.drain({
  exchangeName: exchangeName,
  queueName: config.mqQueueName
});

const allowedModels = [
  'Video'
];

/**
 * @param message object
 * @paramExample
 * {
 *   "id":"145822535763933209",
 *   "type":"model.updated",
 *   "date":"2016-03-17T14:35:57.639Z",
 *   "data": {
 *     "modelName":"Episode",
 *     "changed": ["videoId"],
 *     "previousDataValues": {
 *       "videoId":null,
 *       "_id":2226,
 *       "title":"Ma femme, ses enfants et moi Épisode 34"
 *     },
 *     "dataValues": {
 *       "videoId":"05a6e828-6e73-41fd-8595-a8a4ea7e7142",
 *       "_id":2226,
 *       "title":"Ma femme, ses enfants et moi Épisode 34"
 *     }
 *   }
 * }
 */
function onMessage (message) {
  Q()
    .then(() => {
      const {
        type,
        data: {
          modelName = '',
          changed = [],
          previousDataValues = {},
          dataValues = {}
        }
      } = message;

      if (allowedModels.indexOf(modelName) === -1) {
        return console.log(`[MQ]: Model not allowed to export ${modelName}`);
      }

      switch (type) {
        case 'model.created':
          return onModelCreated(modelName, dataValues._id);
          break;
        case 'model.updated':
          return onModelUpdated(modelName, changed, previousDataValues, dataValues);
          break;
        case 'model.destroyed':
          return onModelDeleted(modelName, dataValues._id);
          break;
        default:
          break;
      }
    })
    .then(
      () => {
      },
      err => console.error(`[MQ]: error on message: ${JSON.stringify(message)}: ${err.message}`, err.stack)
    );
}

/**
 * when a Model is created, we export it
 *
 * @param modelName    string
 * @param model Id    string
 * @return void
 * @throw errors
 */
function onModelCreated (modelName, modelId) {
  console.log('[MQ]: onModelCreated ' + modelName + ' id : ' + modelId);

  return getEntityFromType(modelName, modelId)
    .then(entity => {
      return PFContent.create({
        contentId: entity._id,
        broadcasters: entity.broadcasters,
        contentType: 'url',
        contentUrl: entity.storageUrl
      });
    }).then(entity => {
      console.log('[CLIENT PF]: fetch media info ', entity.contentUrl);
      return mediainfo(entity.contentUrl);
    }).then(info => {
      console.log('[CLIENT PF]: set media info ', info);
      return PFContent.updateAttributes({
        mediaInfo: info
      });
    })
    .then(() => {
      console.log('[CLIENT PF]:start new job (TODO)');
    })
    .then(result => {
      console.log('[MQ]: onModelCreated ', modelName, modelId, result);
    });
}

/**
 * when a Model is updated, we need to ingest the model again
 *
 * @param modelName    string
 * @param changed              array[string]   modified list fields
 * @param previousDataValues   object          { field : val }
 * @param dataValues           object          { field : val }
 * @return void
 * @throw errors
 */
function onModelUpdated (modelName, changed, previousDataValues, dataValues) {
  console.log('[MQ]: onModelUpdated ' + ' ' + dataValues._id);

  return Q()
    .then(() => {
      return getEntityFromType(modelName, dataValues._id)
    })
    .then(entity => {
      if (!entity.storageUrl) {
        throw new Error('[MQ] storageUrl Key undefined, process stopped')
      }
    }).then(result => {
      console.log('[MQ]: onModelUpdated ', modelName, dataValues._id, result);
    });
}

/**
 * when a Model is deleted
 *
 * @param modelName    string
 * @param modelId    string
 * @return void
 * @throw errors
 */
function onModelDeleted (modelName, modelId) {
  console.log('[MQ]: onModelDeleted ' + ' ' + modelId);

  return Q()
    .then(() => {
    }).then(result => {
      console.log('[MQ]: onModelDeleted ', modelName, modelId, result);
    });
}

module.exports = mq;