const config = rootRequire('config');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const _ = require('lodash');

class EncodingApi {

  constructor () {
    this.userId = config.encoding.userId;
    this.userKey = config.encoding.userKey;
  }

  healthCheck () {
    return request({
      uri: 'http://status.encoding.com/status.php?format=json',
      method: 'GET'
    }).then((res) => {
      return JSON.parse(res.body);
    }).then((res) => {
      return res;
    });
  }

  getUserInfo () {
    const params = {
      action: 'GetUserInfo',
      'action_user_id': this.userId
    };
    return this.request(params);
  }

  addMedia ({source, format}) {
    const params = {
      action: 'AddMedia',
      'source': source,
      'format': format
    };
    return this.request(params);
  }

  savePreset ({name, format}) {
    const params = {
      action: 'SavePreset',
      'name': name,
      'format': format
    };
    return this.request(params);
  }

  restartMedia ({mediaId}) {
    const params = {
      action: 'RestartMedia',
      mediaid: mediaId
    };
    return this.request(params);
  }

  cancelMedia ({mediaId}) {
    const params = {
      action: 'RestartMedia',
      mediaid: mediaId
    };
    return this.request(params);
  }

  getMediaList () {
    return this.request({action: 'GetMediaList'});
  }

  getPresetsList () {
    return this.request({action: 'GetPresetsList', type: 'all'});
  }

  getStatus (mediaId) {
    const params = {
      action: 'getstatus',
      mediaid: mediaId
    };
    return this.request(params);
  }

  mergeParams (params) {
    let defaultParams = {
      query: {
        'userid': this.userId,
        'userkey': this.userKey,
        //TODO get request region and transcode near this one
        //'region': 'eu-central-1' //[us-east-1|us-east-2|us-west-1|us-west-2|eu-west-1|eu-central-1|ap-southeast-1|ap-southeast-2|ap-northeast-1|sa-east-1]
      }
    };
    defaultParams.query = _.merge(defaultParams.query, params);
    return 'json=' + JSON.stringify(defaultParams);
  }

  request (params) {
    const postData = this.mergeParams(params);
    console.log(`[ENCODING.COM API]: Request`, postData);
    return request({
      uri: 'http://manage.encoding.com/',
      method: 'POST',
      body: postData,
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    })
      .then((res) => {
        return JSON.parse(res.body);
      })
      .then((res) => {
        if (res.response.status === 'Error') {
          throw new Error(res.response.errors.error);
        }
        if (res.response && res.response.errors && res.response.errors.error) {
          throw new Error(res.response.errors.error);
        }
        console.log(`[ENCODING.COM API]: Response`, res.response);
        return res.response;
      });
  }

}

module.exports = EncodingApi;