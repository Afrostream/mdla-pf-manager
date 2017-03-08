'use strict';

const Sequelize = require('sequelize');
const config = rootRequire('config');

const db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(
    config['afrostream-back-end'].sequelize.uri,
    config['afrostream-back-end'].sequelize.options
  )
};

db.PFBroadcaster = db.sequelize.import('models/pfBroadcaster');
db.PFContent = db.sequelize.import('models/pfContent');
//db.PFProvider = db.sequelize.import('models/pfProvider');
db.PFJob = db.sequelize.import('models/pfjob');

//db.PFProvider.hasMany(db.PFBroadcaster, {as: 'broadcasters'});
db.PFContent.hasMany(db.PFBroadcaster, {as: 'broadcasters'});
db.PFContent.hasMany(db.PFJob, {as: 'jobs', foreignKey: 'contentId'});
db.PFJob.hasOne(db.PFContent, {as: 'content', foreignKey: 'jobId'});

//db.PFJob.sync({force: true});
//db.PFBroadcaster.sync({force: true});
//db.PFProvider.sync({force: true});
//db.PFContent.sync({force: true});

module.exports = db;