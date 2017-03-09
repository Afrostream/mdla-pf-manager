'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFManagerJob = sequelize.define('PFManagerJob', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    status: DataTypes.STRING(32),
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    providerName: DataTypes.STRING(255),
    statusMessage: DataTypes.STRING(255),
    encodingId: DataTypes.STRING(255),
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

  return PFManagerJob;
};
