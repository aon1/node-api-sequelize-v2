const { ClientCredentialsAuthProvider } = require('@twurple/auth')
const { ApiClient } = require('@twurple/api')
const config = require('../../config/config')

const clientId = config.TWITCH_CLIENT_ID
const clientSecret = config.TWITCH_CLIENT_SECRET

const subAuthProvider = new ClientCredentialsAuthProvider(clientId, clientSecret)
const apiClient = new ApiClient({ authProvider: subAuthProvider })

module.exports = {
  getTopGames (filter) {
    return apiClient.games.getTopGames(filter)
  },

  getStreams (filter) {
    return apiClient.streams.getStreams(filter)
  },

  getStreamByUserId (userId) {
    return apiClient.streams.getStreamByUserId(userId)
  },

  getFollowers (filter) {
    return apiClient.users.getFollows(filter)
  }
}
