'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Streamers', [
      {
        id: 1,
        twitchId: '254489093222',
        twitchHandle: 'twitchHandle',
        youtubeId: '254489093221',
        youtubeHandle: 'youtubeHandle',
        name: 'newstreamer'
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
