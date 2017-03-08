module.exports = {
  delivery: '/tmp/delivery',
  // backend requests
  backendApiKey: 'a7c79782-51e5-484c-ab09-aa389f244251',
  backendApiSecret: 'cf825665-68ff-4b99-b8be-d2242ea2e4c4',
  // s3 bucket info
  bucketName: 'mdla-pf-manager',
  //
  mqQueueName: 'mdla-pf-manager',
  //
  bitcodin: {
    apiKey: '7a53651f5f2720269a4ced3f93510e38161e0f9ea5e74b6d6613ab1003ff61be'
  },
  encoding: {
    userId: process.env.ENCODING_API_USER_ID || '94509',
    userKey: process.env.ENCODING_API_USER_KEY || '172b3a0188224db179b5c5813250e6cd'
  }
};