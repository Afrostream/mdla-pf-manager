const { PFClient } = require('afrostream-node-client-pf');

const config = rootRequire('config');

class Client extends PFClient {
  constructor(options) {
    super(Object.assign({}, {
      baseUrl: config.pf.baseUrl,
      pfBroadcasterName: 'ORANGECI'
    }, options || {}));
  }
}

module.exports.Client = Client;
