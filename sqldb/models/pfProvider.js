'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFProvider = sequelize.define('PFProvider', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(32),
    type: DataTypes.STRING(32),
    capabilities: DataTypes.JSON,
    health: DataTypes.JSON,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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

  return PFProvider;
};
