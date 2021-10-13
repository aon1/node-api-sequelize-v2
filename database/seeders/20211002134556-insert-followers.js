'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followers', [
      {
        id: 1,
        streamId: 1,
        count: 10,
        createdAt: '2021-10-03 08:59:22'
      },
      {
        id: 2,
        streamId: 1,
        count: 12,
        createdAt: '2021-10-03 09:09:22'
      },
      {
        id: 3,
        streamId: 2,
        count: 12,
        createdAt: '2021-10-04 10:00:22'
      },
      {
        id: 4,
        streamId: 2,
        count: 12,
        createdAt: '2021-10-04 10:10:22'
      },
      {
        id: 5,
        streamId: 2,
        count: 8,
        createdAt: '2021-10-04 10:20:22'
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
