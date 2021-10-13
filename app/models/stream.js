'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Stream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      models.Stream.belongsTo(models.Streamer)
      models.Stream.belongsTo(models.Game)

      models.Stream.hasMany(models.Viewer)
      models.Stream.hasMany(models.Follower)
    }
  }
  Stream.init({
    streamerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Streamers',
        key: 'id'
      }
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Games',
        key: 'id'
      }
    },
    externalId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false
    },
    finishedAt: {
      type: DataTypes.DATE
    },
    duration: {
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Stream',
    timestamps: false
  })
  return Stream
}
