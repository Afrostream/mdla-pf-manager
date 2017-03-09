const Q = require('q');
const _ = require('lodash');
const mq = require('./../mqPF');
const {MESSAGES} = require('./../consts');
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
          case MESSAGES.JOB_RESTART:
            return this.canTranscodeByBroadcaster(dataValues.broadcasters);
          default:
            return false;
        }
      })
      .then((canTranscode) => {
        if (!canTranscode.length) {
          if (_.isArray(canTranscode)) {
            console.log(`[MQPFM]: Provider ${this.name_} can't transcode ${dataValues.jobId} for broadcasters : ${dataValues.broadcasters}`);
          }
          return false;
        }
        return this.createTask(dataValues);
      })
      .then(
        (task) => {
          if (!task) {
            //no task result ... do nothing
            return task;
          }

          console.log(`[MQPFM]: Provider ${this.name_}`, task);

          this.sendMessage({
            type: MESSAGES.JOB_READY,
            data: {
              dataValues: {
                jobId: dataValues.jobId,
                mediaId: task.mediaId
              }
            }
          });

          return task;
        },
        (error) => {
          console.error(`[MQPFM]: error on message: ${type}`, error.stack);
          return this.sendMessage({
            type: MESSAGES.JOB_ERROR,
            error,
            data: {
              dataValues
            }
          });
        }
      );
  }

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

  canTranscodeByBroadcaster (broadcasters) {
    return Q()
      .then(() => {
        return _.intersection(this.broadcasters_, broadcasters);
      });
  }

  name () {
    return this.name_;
  }

  infos () {
    return {
      name: this.name_,
      status: this.healthCheck()
    };
  }

  jobsList () {
    return [];
  }

  createTask (data) {
    return Q()
      .then(() => {
        console.log(`[MQPFM]: Provider ${this.name_} createTask ${data}`);
        return false;
      });
  }

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