const TranscodingProvider = require('../transcodingProvider');
const EncodingApi = require('./encodingcom.api.js');
// Food is a base class
class EncodingcomProvider extends TranscodingProvider {

  constructor (options) {
    super(options);
    this.api = new EncodingApi();
  }

  createTask () {
    return super.createTask();
  }

  presets () {
    return this.api.getPresetsList();
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