'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('viewers', [
      {
        id: 1,
        streamId: 1,
        count: 10
      },
      {
        id: 2,
        streamId: 1,
        count: 20
      },
      {
        id: 3,
        streamId: 1,
        count: 30
      },
      {
        id: 4,
        streamId: 1,
        count: 35
      },
      {
        id: 5,
        streamId: 1,
        count: 36
      },
      {
        id: 6,
        streamId: 1,
        count: 41
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
