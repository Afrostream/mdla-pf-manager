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

db.PFManagerBroadcaster = db.sequelize.import('models/pfManagerBroadcaster');
db.PFManagerContent = db.sequelize.import('models/pfManagerContent');
db.PFManagerPreset = db.sequelize.import('models/pfManagerPreset');
db.PFManagerJob = db.sequelize.import('models/pfManagerJob');

db.PFManagerContent.hasMany(db.PFManagerBroadcaster, {as: 'broadcasters'});
db.PFManagerContent.hasMany(db.PFManagerJob, {as: 'jobs', foreignKey: 'contentId'});
db.PFManagerJob.hasOne(db.PFManagerContent, {as: 'content', foreignKey: 'jobId'});

//db.PFManagerJob.sync({force: true});
//db.PFManagerBroadcaster.sync({force: true});
//db.PFManagerPreset.sync({force: true});
//db.PFManagerContent.sync({force: true});

module.exports = db;