'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFManagerProfile = sequelize.define('PFManagerProfile', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(128),
    description: DataTypes.TEXT,
    //TODO add templates crop|rotation|
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

  return PFManagerProfile;
};
