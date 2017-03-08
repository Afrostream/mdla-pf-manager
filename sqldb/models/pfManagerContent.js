'use strict';
module.exports = function (sequelize, DataTypes) {
  const PFManagerContent = sequelize.define('PFManagerContent', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    contentType: DataTypes.STRING(32),
    contentUrl: DataTypes.STRING(2048),
    countries: DataTypes.ARRAY(DataTypes.STRING(2)),
    filename: DataTypes.STRING(255),
    mediaInfo: DataTypes.JSON,
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

  return PFManagerContent;
};
