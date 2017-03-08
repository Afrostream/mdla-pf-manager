const Q = require('q');
const _ = require('lodash');
const mq = require('./../mqPF');
const MESSAGES = require('./../consts');
// Food is a base class
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
          case MESSAGES.JOB_CREATED:
            return this.canTranscodeByBroadcaster(dataValues.broadcasters);
            break;
          default:
            break;
        }
      })
      .then((canTranscode) => {
        if (!canTranscode.length) {
          console.log(`[MQPF]: Provider ${this.name_} can't transcode ${dataValues.jobId}`);
          return false;
        }
        return this.createTask();
      })
      .then(
        (task) => {
          return task;
        },
        err => console.error(`[MQPF]: error on message: ${JSON.stringify(message)}: ${err.message}`, err.stack)
      );
  }

  canTranscodeByBroadcaster (broadcasters) {
    return Q()
      .then(() => {
        console.log('[MQPF]: ', broadcasters, this.broadcasters_);
        return _.intersection(this.broadcasters_, broadcasters);
      })
  }

  name () {
    return this.name_;
  }

  infos () {
    return {
      name: this.name_,
      status: this.healthCheck()
    }
  }

  createTask (options) {
    return Q()
      .then(() => {
        console.log(`[MQPF]: Provider ${this.name_}  createTask`, options);
      })
  }

  healthCheck () {
    return {
      status: 'Ok',
      status_code: 'PF Status code',
      incident: 'none'
    }
  }
}

TranscodingProvider.prototype.name_ = 'no-name';

TranscodingProvider.prototype.broadcasters_ = [];

module.exports = TranscodingProvider;