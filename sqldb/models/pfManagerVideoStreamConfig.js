'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFManagerVideoStreamConfig = sequelize.define('PFManagerVideoStreamConfig', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    bitrate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 400
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 426
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 240
    },
    gopSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 90
    },
    gopMode: {
      type: DataTypes.STRING(DataTypes.ENUM('fixed', 'cgop', 'sgop')),
      allowNull: false,
      defaultValue: 'fixed'
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24
    },
    interlaceMode: DataTypes.STRING(DataTypes.ENUM('progressive', 'auto')), //TODO map all codecs list
    codec: DataTypes.STRING(DataTypes.ENUM('h264', 'hevc', 'vp9', 'ts', 'mss', 'hls', 'dash')), //TODO map all codecs list
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

  return PFManagerVideoStreamConfig;
};
