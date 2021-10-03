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
      //   , {
      //   as: 'Streamer'
      //   // foreignKey: {
      //   //   allowNull: false
      //   // }
      // })
      models.Stream.belongsTo(models.Game)
      //   {
      //   as: 'Game'
      //   // foreignKey: {
      //   //   allowNull: false
      //   // }
      // })
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
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false
    },
    finishedAt: {
      type: DataTypes.DATE
    },
    hourCount: {
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Stream',
    timestamps: false
  })
  return Stream
}
