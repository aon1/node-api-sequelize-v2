'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Streamer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      models.Streamer.hasMany(models.Stream)
    }
  }
  Streamer.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING
    },
    twitchId: {
      type: DataTypes.STRING,
      unique: true
    },
    twitchHandle: {
      type: DataTypes.STRING
    },
    youtubeId: {
      type: DataTypes.STRING,
      unique: true
    },
    youtubeHandle: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Streamer',
    paranoid: true
  })
  return Streamer
}
