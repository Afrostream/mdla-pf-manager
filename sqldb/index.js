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
db.PFManagerVideoStreamConfig = db.sequelize.import('models/pfManagerVideoStreamConfig');
db.PFManagerAudioStreamConfig = db.sequelize.import('models/pfManagerAudioStreamConfig');
db.PFManagerPreset = db.sequelize.import('models/pfManagerPreset');
db.PFManagerPresetMap = db.sequelize.import('models/pfManagerPresetMap');
db.PFManagerProfile = db.sequelize.import('models/pfManagerProfile');
db.PFManagerJob = db.sequelize.import('models/pfManagerJob');

db.PFManagerContentBroadcasters = db.sequelize.import('models/pfManagerContentBroadcasters');
db.PFManagerProfilePresets = db.sequelize.import('models/pfManagerProfilePresets');

db.PFManagerContent.hasMany(db.PFManagerJob, {as: 'jobs', foreignKey: 'contentId'});
db.PFManagerContent.belongsToMany(db.PFManagerBroadcaster, {
  as: 'broadcasters',
  through: db.PFManagerContentBroadcasters
});

db.PFManagerJob.belongsTo(db.PFManagerContent, {as: 'content', foreignKey: 'jobId'});

db.PFManagerPreset.hasOne(db.PFManagerVideoStreamConfig, {
  as: 'videoStreamConfig',
  foreignKey: 'presetId'
});
db.PFManagerPreset.hasOne(db.PFManagerAudioStreamConfig, {
  as: 'audioStreamConfig',
  foreignKey: 'presetId'
});

db.PFManagerPreset.hasMany(db.PFManagerPresetMap, {
  as: 'mapProvidersPresets',
  foreignKey: 'presetId'
});

db.PFManagerBroadcaster.hasMany(db.PFManagerProfile, {as: 'profiles', foreignKey: 'broadcasterId'});
db.PFManagerProfile.belongsToMany(db.PFManagerPreset, {as: 'presets', through: db.PFManagerProfilePresets});
//TODO captions Config
//db.PFManagerPreset.sync({force: true});
//db.PFManagerPresetMap.sync({force: true});
//db.PFManagerProfile.sync({force: true});
//db.PFManagerJob.sync({force: true});
//db.PFManagerAudioStreamConfig.sync({force: true});
//db.PFManagerVideoStreamConfig.sync({force: true});
//db.PFManagerContent.sync({force: true});
//db.PFManagerBroadcaster.sync({force: true});
//db.PFManagerContentBroadcasters.sync({force: true});
//db.PFManagerProfilePresets.sync({force: true});
module.exports = db;