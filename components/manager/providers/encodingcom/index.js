const TranscodingProvider = require('../transcodingProvider');
const EncodingApi = require('./encodingcom.api.js');
const Q = require('q');
// Food is a base class
class EncodingcomProvider extends TranscodingProvider {

  constructor (options) {
    super(options);
    this.api = new EncodingApi();
  }

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
          mediaId: res.MediaID
        };
      });
  }

  presets () {
    return this.api.getPresetsList();
  }

  jobsList () {
    return this.api.getMediaList();
  }

  getStatus (encodingId) {
    return this.api.getStatus(encodingId);
  }

  healthCheck () {
    return this.api.healthCheck();
  }
}

EncodingcomProvider.prototype.name_ = 'encodingcom';

EncodingcomProvider.prototype.broadcasters_ = ['AFROSTREAM'];

module.exports = EncodingcomProvider;