'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFManagerAudioStreamConfig = sequelize.define('PFManagerAudioStreamConfig', {
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
    codec: DataTypes.STRING(DataTypes.ENUM('aac', 'mp3')), //TODO map all codecs list
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

  return PFManagerAudioStreamConfig;
};
