const { StaticAuthProvider } = require('@twurple/auth')
const { ApiClient } = require('@twurple/api')
const config = require('../../config/config')

const clientId = config.TWITCH_CLIENT_ID
const accessToken = config.TWITCH_ACCESS_TOKEN

const authProvider = new StaticAuthProvider(clientId, accessToken)
const apiClient = new ApiClient({ authProvider })

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
