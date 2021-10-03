'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      models.Follower.belongsTo(models.Stream)
    }
  }
  Follower.init({
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
    }
  }, {
    sequelize,
    modelName: 'Follower',
    timestamps: false
  })
  return Follower
}
