'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Templates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Templates.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    doc: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Templates',
  });
  return Templates;
};