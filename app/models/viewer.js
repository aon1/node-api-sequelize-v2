'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Viewer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      models.Viewer.belongsTo(models.Stream, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  }
  Viewer.init({
    streamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Streams',
        key: 'id'
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: false
  }, {
    sequelize,
    modelName: 'Viewer'
  })
  return Viewer
}
