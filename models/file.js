'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  File.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    link: DataTypes.STRING,
    size: DataTypes.BIGINT,
    path: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    parent: DataTypes.INTEGER,
    childs: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};