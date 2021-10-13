'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Streams', [
      {
        id: 1,
        streamerId: 1,
        gameId: 1,
        externalId: '1',
        startedAt: '2021-10-02 13:29:30',
        finishedAt: '2021-10-02 16:29:30',
        duration: 3
      },
      {
        id: 2,
        streamerId: 1,
        gameId: 1,
        externalId: '2',
        startedAt: '2021-10-02 13:38:30',
        finishedAt: '2021-10-02 19:38:30',
        duration: 6
      },
      {
        id: 3,
        streamerId: 1,
        gameId: 2,
        externalId: '3',
        startedAt: '2021-10-02 09:29:30',
        finishedAt: '2021-10-02 16:29:30',
        duration: 8
      },
      {
        id: 4,
        streamerId: 1,
        gameId: 2,
        externalId: '4',
        startedAt: '2021-09-01 09:29:30',
        finishedAt: '2021-09-01 16:29:30',
        duration: 8
      },
      {
        id: 5,
        streamerId: 1,
        gameId: 2,
        externalId: '5',
        startedAt: '2021-08-02 09:29:30',
        finishedAt: '2021-08-02 16:29:30',
        duration: 8
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
