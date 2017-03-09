const TranscodingProvider = require('../transcodingProvider');
const EncodingApi = require('./encodingcom.api.js');
const _ = require('lodash');
const Q = require('q');
const {STATUS} = require('../../constants');
/** @inheritdoc */
class EncodingcomProvider extends TranscodingProvider {

  constructor (options) {
    super(options);
    this.api = new EncodingApi();
  }

  /** @inheritdoc */
  createTask (data) {
    console.log(`[MQPFM]: Provider ${this.name_} createTask`);
    return Q()
      .then(() => {
        //task already started try to restart
        if (data.encodingId) {
          return this.api.restartMedia({mediaId: data.encodingId});
        }

        return this.api.addMedia({
          source: data.mediaInfo.complete_name,
          format: {
            'output_preset': '3GP 144p 256k'
          }
        });

      }).then((res) => {
        return {
          encodingId: res.MediaID || data.encodingId,//On restart encoding don't pass mediaId, so get prev
          message: res.message
        };
      });
  }

  /** @inheritdoc */
  presets () {
    return this.api.getPresetsList();
  }

  /** @inheritdoc */
  jobsList () {
    return this.api.getMediaList();
  }

  /** @inheritdoc */
  getStatus (encodingId) {
    return Q()
      .then(() => {
        return this.api.getStatus(encodingId);
      })
      .then((res) => {
        let mapStatus = super.getStatus();
        // Map keys with api
        mapStatus = _.pick(res, _.keys(mapStatus));
        // Map Status
        //'New', 'Waiting for encoder', 'Processing', 'Saving', 'Finished', 'Error'.
        switch (res.status) {
          case 'Waiting for encoder':
            mapStatus.status = STATUS.JOB.WAITING;
            break;
          case 'Downloading':
            mapStatus.status = STATUS.JOB.DOWNLOADING;
            break;
          case 'Processing':
            mapStatus.status = STATUS.JOB.RUNNING;
            break;
          case 'Saving':
            mapStatus.status = STATUS.JOB.SAVING;
            break;
          case 'Finished':
            mapStatus.status = STATUS.JOB.COMPLETE;
            break;
          case 'Error':
            mapStatus.status = STATUS.JOB.ERROR;
            break;
          default:
            mapStatus.status = res.status || STATUS.JOB.SOMEOTHERSTATUS;
            break;
        }
        //map url
        mapStatus.contentUrl = res.sourcefile;
        mapStatus.json = res;

        return mapStatus;
      });
  }

  /** @inheritdoc */
  healthCheck () {
    return this.api.healthCheck();
  }
}

EncodingcomProvider.prototype.name_ = 'encodingcom';

EncodingcomProvider.prototype.broadcasters_ = ['AFROSTREAM'];

module.exports = EncodingcomProvider;