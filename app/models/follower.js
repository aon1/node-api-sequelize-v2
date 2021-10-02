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
      models.Follower.belongsTo(models.Streamer, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  Follower.init({
    streamerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Streamers',
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
    modelName: 'Follower'
  })
  return Follower
}