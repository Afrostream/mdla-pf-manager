'use strict';
const ManagerConstants = rootRequire('components/manager/constants');

module.exports = function (sequelize, DataTypes) {
  const PFManagerPreset = sequelize.define('PFManagerPreset', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.STRING(32),
      defaultValue: ManagerConstants.STATUS.PRESET.PENDING
    },
    statusMessage: DataTypes.JSON,
    name: DataTypes.STRING(128),
    description: DataTypes.TEXT,
    container: DataTypes.STRING(DataTypes.ENUM('m3u8', 'mp4', 'mpd', 'webm')),
    profile: DataTypes.STRING(DataTypes.ENUM('high', 'main', 'baseline', 'hq')),
    rateControl: DataTypes.STRING(DataTypes.ENUM('VBR', 'CBR')), //variable bitrate|contant bitrate
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  });

  return PFManagerPreset;
};
