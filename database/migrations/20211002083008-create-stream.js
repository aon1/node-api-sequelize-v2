'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Streams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      streamerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Streamers',
          key: 'id'
        }
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Games',
          key: 'id'
        }
      },
      externalId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      site: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      finishedAt: {
        type: Sequelize.DATE
      },
      duration: {
        type: Sequelize.FLOAT
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Streams')
  }
}
