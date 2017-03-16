'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFManagerPresetMap = sequelize.define('PFManagerPresetMap', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(32),
    output: DataTypes.JSON,
    providerName: DataTypes.STRING(128),
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

  return PFManagerPresetMap;
};
