const {EncodingcomProvider, BitmovinProvider, TranscodingProvider} = require('./providers');
const Q = require('q');
const _ = require('lodash');
const mq = require('./mqPF');
const {JOB_STATUS, MESSAGES} = require('./consts');

const sqldb = rootRequire('sqldb');
const PFManagerJob = sqldb.PFManagerJob;

class PFManager {

  constructor () {
    this.transcodingProvider = new TranscodingProvider();
    this.encodingcom = new EncodingcomProvider();
    this.bitmovin = new BitmovinProvider();
    mq.on('message', this.onMessage.bind(this));
  }

  sendMessage (message) {

    console.log(`[MQPFM]: [PFMANAGER] sendMessage: ${message.type}`);

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

  onMessage (message) {
    const {
      type,
      error,
      data: {
        dataValues = {}
      }
    } = message;
    Q()
      .then(() => {
        switch (type) {
          case MESSAGES.JOB_ERROR:
          case MESSAGES.JOB_READY:
            return this.updateJob(type, dataValues, error);
          default:
            return false;
        }
      })
      .then(
        (result) => {
          console.log(`[MQPFM]: message: ${JSON.stringify(message)}`, result);
        },
        err => console.error(`[MQPFM]: error on message: ${JSON.stringify(message)}: ${err.message}`, err.stack)
      );
  }

  updateJob (type, data, error) {
    return Q()
      .then(() => {
        return PFManagerJob.find({
          where: {
            _id: data.jobId
          }
        });
      }).then((job) => {

        if (!job) {
          throw new Error(`[MQPFM]: [PFMANAGER] job not found: ${data.jobId}`);
        }
        switch (type) {
          case MESSAGES.JOB_ERROR:
            job.status = JOB_STATUS.ERROR;
            job.statusMessage = error.message;
            break;
          case MESSAGES.JOB_READY:
            job.status = JOB_STATUS.READY;
            job.mediaId = data.mediaId;
            break;
          default:
            return false;
        }
        if (!job) {
          throw new Error(`[MQPFM]: [PFMANAGER] job save: ${data.jobId}`);
        }
        return job.save();
      });
  }

  showAll () {
    return Q.all([
      this.getProviderByName('encodingcom').infos(),
      this.getProviderByName('bitmovin').infos(),
      this.getProviderByName('no-name').infos()
    ]);
  }

  getProviderByName (type) {
    let provider = null;
    switch (type) {
      case this.encodingcom.name():
        provider = this.encodingcom;
        break;
      case this.bitmovin.name():
        provider = this.bitmovin;
        break;
      default:
        provider = this.transcodingProvider;
        break;
    }
    return provider;
  }

}

PFManager.prototype.MESSAGES = MESSAGES;
PFManager.prototype.JOB_STATUS = JOB_STATUS;

module.exports = new PFManager();