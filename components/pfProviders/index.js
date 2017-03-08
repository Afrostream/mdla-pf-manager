const {EncodingcomProvider, BitmovinProvider, TranscodingProvider} = require('./providers');
const Q = require('q');
const _ = require('lodash');
const mq = require('./mqPF');
const MESSAGES = require('./consts');

class PFProviders {

  constructor () {
    this.transcodingProvider = new TranscodingProvider();
    this.encodingcom = new EncodingcomProvider();
    this.bitmovin = new BitmovinProvider();
  }

  sendMessage (message) {
    message = _.merge({
      id: String(Date.now()) + String(Math.round(Math.random() * 100000)),
      date: new Date().toISOString(),
      data: {
        dataValues: {}
      }
    }, message);

    return mq.send(message);
  }

  showAll () {
    return Q.all([
      this.getProviderByName('encodingcom').infos(),
      this.getProviderByName('bitmovin').infos(),
      this.getProviderByName('no-name').infos()
    ]);
  }

  getProviderByName (type) {
    switch (type) {
      case this.encodingcom.name():
        return this.encodingcom;
        break;
      case this.bitmovin.name():
        return this.bitmovin;
        break;
      default:
        return this.transcodingProvider;
        break
    }
  }

}

PFProviders.prototype.MESSAGES = MESSAGES;

module.exports = new PFProviders();