const TranscodingProvider = require('../transcodingProvider');
const EncodingApi = require('./encodingcom.api.js');
const Q = require('q');
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
        return this.api.addMedia({
          source: data.mediaInfo.complete_name,
          format: {
            'output_preset': '3GP 144p 256k'
          }
        });
      }).then((res) => {
        return {
          mediaId: res.MediaID,
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
    return this.api.getStatus(encodingId);
  }

  /** @inheritdoc */
  healthCheck () {
    return this.api.healthCheck();
  }
}

EncodingcomProvider.prototype.name_ = 'encodingcom';

EncodingcomProvider.prototype.broadcasters_ = ['AFROSTREAM'];

module.exports = EncodingcomProvider;