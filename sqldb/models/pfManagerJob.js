'use strict';

const ManagerConstants = rootRequire('components/manager/constants');

module.exports = function (sequelize, DataTypes) {
  const PFManagerJob = sequelize.define('PFManagerJob', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.STRING(32),
      defaultValue: ManagerConstants.STATUS.JOB.PENDING
    },
    statusMessage: DataTypes.JSON,
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    providerName: DataTypes.STRING(255),
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
