'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFBroadcaster = sequelize.define('PFBroadcaster', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(64),
    capabilities: DataTypes.JSON,
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

  return PFBroadcaster;
};
