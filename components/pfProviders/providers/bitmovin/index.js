const config = rootRequire('config');
const TranscodingProvider = require('../transcodingProvider');
const BitcodingApi = require('bitcodin')(config.bitcodin.apiKey);
// Food is a base class
class BitmovinProvider extends TranscodingProvider {

  constructor (options) {
    super(options);
  }

  createTask (options) {

  }

  healthCheck () {
    return {
      ok: false,
      message: 'provider undefined'
    }
  }
}

BitmovinProvider.prototype.name_ = 'bitmovin';

BitmovinProvider.prototype.broadcasters_ = ['AFROSTREAM'];

BitmovinProvider.name = () => {
  return BitmovinProvider.prototype.name_;
};

module.exports = BitmovinProvider;