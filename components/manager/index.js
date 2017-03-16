'use strict';

const {
  PFManagerJob,
  PFManagerPreset,
  PFManagerPresetMap
} = rootRequire('sqldb');

const {EncodingcomProvider, BitmovinProvider, TranscodingProvider} = require('./providers');
const Q = require('q');
const _ = require('lodash');
const mqPF = require('./mqPF');
const {STATUS, MESSAGES} = require('./constants');
class PFManager {

  constructor () {
    this.transcodingProvider = new TranscodingProvider();
    this.encodingcom = new EncodingcomProvider();
    this.bitmovin = new BitmovinProvider();
    mqPF.on('message', this.onMessage.bind(this));
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

    return mqPF.send(message);
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
          case MESSAGES.JOB.ERROR:
          case MESSAGES.JOB.READY:
          case MESSAGES.JOB.UPDATED_STATUS:
            return this.updateJob(type, dataValues, error);
          case MESSAGES.PRESET.ERROR:
          case MESSAGES.PRESET.READY:
            return this.updatePreset(type, dataValues, error);
          case MESSAGES.BID.OFFER:
            return this.onBidOffer(dataValues);
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

  /**
   * Job status Updated from MQ
   * @param type
   * @param data
   * @param error
   * @returns {Promise.<TResult>}
   */
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
          case MESSAGES.JOB.ERROR:
            job.status = STATUS.JOB.ERROR;
            job.statusMessage = error.message;
            break;
          case MESSAGES.JOB.READY:
            job.status = STATUS.JOB.READY;
            job.statusMessage = data.message;
            job.encodingId = data.encodingId;
            break;
          case MESSAGES.JOB.UPDATED_STATUS:
            job.status = data.status;
            job.progress = data.progress;
            break;
          default:
            return false;
        }

        console.log(`[MQPFM]: [PFMANAGER] job updated: ${data.jobId} ${type}`);

        return job.save();
      });
  }

  /**
   * Preset status Updated from MQ
   * @param type
   * @param data
   * @param error
   * @returns {Promise.<TResult>}
   */
  updatePreset (type, data, error) {
    return Q()
      .then(() => {
        return PFManagerPreset.find({
          where: {
            _id: data.presetId
          }
        });
      }).then((preset) => {
        if (!preset) {
          throw new Error(`[MQPFM]: [PFMANAGER] preset not found: ${data.presetId}`);
        }
        switch (type) {
          case MESSAGES.PRESET.ERROR:
            preset.status = STATUS.PRESET.ERROR;
            preset.statusMessage = error.message;
            break;
          case MESSAGES.PRESET.READY:
            preset.status = STATUS.PRESET.READY;
            preset.statusMessage = data.message;
            //generete presetMap
            const mappedPreset = PFManagerPresetMap.build({
              name: data.presetName,
              providerName: data.provider,
              output: data.message
            });

            console.log('mappedPreset', mappedPreset);
            //inject presetMap
            return mappedPreset.save().then((entity) => {
              return preset.addMapProvidersPresets(entity).then(() => preset.save());
            });
            break;
          case MESSAGES.PRESET.UPDATED_STATUS:
            preset.status = data.status;
            break;
          default:
            return false;
        }

        console.log(`[MQPFM]: [PFMANAGER] preset updated: ${data.presetId} ${type}`);

        return preset.save();
      });
  }

  /**
   * Job Accepted from PF (compare All)
   * @param data
   * @returns {Promise.<TResult>}
   */
  onBidOffer (data) {
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
        //save bidded provider name
        //TODO make Bidder method
        //multiple worker bidder ????
        job.providerName = data.providerName;
        return job.save();
      }).then((job) => {
        return this.sendMessage({
          type: MESSAGES.BID.ACCEPTED,
          data: {
            dataValues: _.merge(data, {
              encodingId: job.encodingId
            })
          }
        });
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
PFManager.prototype.STATUS = STATUS;

module.exports = new PFManager();