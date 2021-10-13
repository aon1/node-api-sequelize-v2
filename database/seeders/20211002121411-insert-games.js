'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Games', [
      {
        id: 1,
        name: 'Just Chatting',
        twitchId: '509658',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/New%20World-{width}x{height}.jpg'
      },
      {
        id: 2,
        name: 'Minecraft',
        twitchId: '27471',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/Minecraft-{width}x{height}.jpg'
      },
      {
        id: 3,
        name: 'Grand Theft Auto V',
        twitchId: '32982',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/Grand%20Theft%20Auto%20V-{width}x{height}.jpg'
      },
      {
        id: 4,
        name: 'FIFA 22',
        twitchId: '1869092879',
        boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/FIFA%2022-{width}x{height}.jpg'
      },
      {
        id: 5,
        name: 'Counter-Strike: Global Offensive',
        twitchId: '32399',
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
