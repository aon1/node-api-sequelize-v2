const { google } = require('googleapis')

const config = require('../../config/config')

const apiKey = config.YOUTUBE_API_KEY

module.exports = {
  getUsers (username) {
    google.youtube('v3').channels.list({
      key: apiKey,
      part: 'snippet',
      forUsername: username
    }).then((response) => {
      const { data } = response
      console.log(response.data.items)
    })
  },

  getStreams (channelId) {
    google.youtube('v3').search.list({
      key: apiKey,
      part: 'snippet',
      eventType: 'live',
      type: 'video',
      channelId: channelId
    }).then((response) => {
      const { data } = response
      console.log(response.data.items)
    })
  }
}
