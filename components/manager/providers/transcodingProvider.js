const Q = require('q');
const _ = require('lodash');
const mq = require('./../mqPF');
const {MESSAGES} = require('./../constants');

/**
 * Base Transcodding Provider class
 */
class TranscodingProvider {

  constructor () {
    mq.on('message', this.onMessage.bind(this));
  }

  /**
   * @param message object
   * @paramExample
   * {
   *   "id":"145822535763933209",
   *   "type":"pf.job.created",
   *   "date":"2016-03-17T14:35:57.639Z",
   *   "data": {
   *     "dataValues": {
   *       "jobId":"05a6e828-6e73-41fd-8595-a8a4ea7e7142",
   *       "contentId":"05a6e828-6e73-41fd-8595-a8a4ea7e7142",
   *     }
   *   }
   * }
   */
  onMessage (message) {

    const {
      type,
      data: {
        dataValues = {}
      }
    } = message;

    Q()
      .then(() => {
        switch (type) {
          case MESSAGES.JOB.CREATED:
          case MESSAGES.JOB.RESTART:
            return this.canTranscodeByBroadcaster(dataValues);
          case MESSAGES.BID.ACCEPTED:
            return this.bidTranscodeAccepted(dataValues);
          default:
            return false;
        }
      })
      .then(
        (message) => {
          if (!message) {
            //no task result ... do nothing
            return false;
          }
          console.log(`[MQPFM]: Provider ${this.name_}`, message);
          //TODO create bidding method by provider (now apply bidding for first match)
          this.sendMessage(message);

          return message;
        },
        (error) => {
          console.error(`[MQPFM]: error on message: ${type}`, error.stack);
          return this.sendMessage({
            type: MESSAGES.JOB.ERROR,
            error,
            data: {
              dataValues
            }
          });
        }
      );
  }

  /**
   * Send message to RabbitMQ
   * @param message
   */
  sendMessage (message) {

    console.log(`[MQPFM]: Provider ${this.name_} sendMessage: ${message.type}`);

    message = _.merge({
      id: String(Date.now()) + String(Math.round(Math.random() * 100000)),
      date: new Date().toISOString(),
      error: null,
      data: {
        dataValues: {}
      }
    }, message);

    return mq.send(message);
  }

  /**
   * Detect if provider can transcode Job
   * @param data
   * @returns {Promise.<TResult>}
   */
  canTranscodeByBroadcaster (data) {
    return Q()
      .then(() => {
        return _.intersection(this.broadcasters_, data.broadcasters);
      }).then((canTranscode) => {
        if (!canTranscode.length) {
          if (_.isArray(canTranscode)) {
            console.log(`[MQPFM]: Provider ${this.name_} can't transcode ${data.jobId} for broadcasters : ${data.broadcasters}`);
          }
          return false;
        }
        return {
          type: MESSAGES.BID.OFFER,
          data: {
            dataValues: _.merge(data, {
              providerName: this.name_
            })
          }
        };
        return true;
      });
  }

  /**
   * Message trancode Job accepted start encoding
   * @param data
   * @returns {Promise.<TResult>}
   */
  bidTranscodeAccepted (data) {
    return Q()
      .then(() => {
        if (data.providerName !== this.name_) {
          return false
        }
        return this.createTask(data);
      })
      .then((task) => {
        if (!task) {
          //no task result ... do nothing
          return false;
        }

        return {
          type: MESSAGES.JOB.READY,
          data: {
            dataValues: {
              jobId: data.jobId,
              mediaId: task.mediaId,
              message: task.message
            }
          }
        };
      });
  }

  /**
   * Get PF Provider Name
   * @returns {string}
   */
  name () {
    return this.name_;
  }

  /**
   * Get all PF Provider Presets List
   * @returns {Array}
   */
  presets () {
    return [];
  }

  /**
   * Get PF Provider informations
   * @returns {{name: string, status: ({status, status_code, incident}|*)}}
   */
  infos () {
    return {
      name: this.name_,
      status: this.healthCheck()
    };
  }

  /**
   * Get ALL PF Provider Jobs list
   * @returns {Array}
   */
  jobsList () {
    return [];
  }

  /**
   * Start encoding PF Job
   * @param data
   * @returns {*}
   */
  createTask (data) {
    return Q()
      .then(() => {
        console.log(`[MQPFM]: Provider ${this.name_} createTask ${data}`);
        return false;
      });
  }

  /**
   * Get Statuts of PF API
   * @returns {{status: string, status_code: string, incident: string}}
   */
  healthCheck () {
    return {
      status: 'Ok',
      status_code: 'PF Status code',
      incident: 'none'
    };
  }
}

TranscodingProvider.prototype.name_ = 'no-name';

TranscodingProvider.prototype.broadcasters_ = [];

module.exports = TranscodingProvider;