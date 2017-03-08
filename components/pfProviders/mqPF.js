'use strict';

// exporting an instance
const config = rootRequire('config');
const AMQP = require('afrostream-node-amqp');
const MESSAGES = require('./consts');
const configMQ = config['mdla-client-pf'].mq;
const exchangeName = configMQ.exchangeName;
var mqPF = new AMQP(configMQ);
var localQueue = [];

mqPF.send = data => {
  try {
    mqPF.channel.publish(exchangeName, '', new Buffer(JSON.stringify(data)));
    console.log('[MQPF-published]: send ' + JSON.stringify(data));
  } catch (e) {
    if (configMQ.displayErrors) {
      console.error('[MQPF-published]: error ' + e + ', stacking message');
    }
    setImmediate(() => {
      localQueue.push(JSON.parse(JSON.stringify(data)));
      // security: if the nb of standby events is too large, skip the old ones
      if (localQueue.length > 10000) {
        localQueue.shift();
      }
    });
  }
};

mqPF.drain({
  exchangeName: exchangeName,
  queueName: config.mqQueueName
});

module.exports = mqPF;