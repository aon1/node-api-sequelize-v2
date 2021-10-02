'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('streamers', [
      {
        externalId: '254489093',
        login: 'casimito',
        email: 'casimito@casimito.com',
        name: 'casimito',
        site: 'twitch'
      },
      {
        externalId: '552743899',
        login: 'luidematos',
        email: 'luidematos@luidematos.com',
        name: 'luidematos',
        thumbnail: null,
        site: 'twitch'
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
