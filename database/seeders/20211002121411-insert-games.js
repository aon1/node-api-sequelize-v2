'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('games', [
      {
        name: 'Just Chatting',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/New%20World-{width}x{height}.jpg'
      },
      {
        name: 'Minecraft',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/Minecraft-{width}x{height}.jpg'
      },
      {
        name: 'Grand Theft Auto V',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/Grand%20Theft%20Auto%20V-{width}x{height}.jpg'
      },
      {
        name: 'FIFA 22',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/FIFA%2022-{width}x{height}.jpg'
      },
      {
        name: 'Counter-Strike: Global Offensive',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/./Counter-Strike:%20Global%20Offensive-{width}x{height}.jpg'
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
