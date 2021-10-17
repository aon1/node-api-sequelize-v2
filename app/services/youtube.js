const { google } = require('googleapis')

const config = require('../../config/config')

const apiKey = config.YOUTUBE_API_KEY

module.exports = {
  getStreams (channelId) {
    return google.youtube('v3').search.list({
      key: apiKey,
      part: 'snippet',
      eventType: 'live',
      type: 'video',
      channelId: channelId
    })
  },

  getVideoDetails (videoId) {
    return google.youtube('v3').videos.list({
      key: apiKey,
      part: 'snippet,liveStreamingDetails',
      id: videoId
    })
  },

  getChannelStatistics (channelId) {
    return google.youtube('v3').channels.list({
      key: apiKey,
      part: 'statistics',
      id: channelId
    })
  }
}
