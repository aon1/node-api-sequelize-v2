const sequelize = require('sequelize')
const youtubeApi = require('../services/youtube')
const { Streamer, Stream, Viewer, Follower } = require('../models')
const { logger } = require('../services/logger')
const { Op } = require('sequelize')

module.exports = {
  async fetchStreamsJob (req, res) {
    try {
      const streamers = await Streamer.findAll({
        where: {
          youtubeId: {
            [Op.not]: null
          }
        }
      })

      const streamersMap = new Map(streamers.map(i => [i.youtubeId, i]))

      for (const streamer of streamers) {
        const streams = await youtubeApi.getStreams(streamer.youtubeId)

        for (const st of streams.data.items) {
          const videoDetails = (await youtubeApi.getVideoDetails(st.id.videoId)).data.items[0]
          if (videoDetails.snippet.categoryId !== '20') {
            break
          }

          const createdStream = await Stream.findOrCreate({
            where: {
              externalId: st.id.videoId
            },
            defaults: {
              streamerId: streamersMap.get(st.snippet.channelId).id,
              externalId: st.id.videoId,
              startedAt: videoDetails.liveStreamingDetails.actualStartTime,
              gameId: 4625,
              site: 'youtube'
            }
          })

          Viewer.create({
            streamId: createdStream[0].id,
            count: videoDetails.liveStreamingDetails.concurrentViewers
          })

          const statistics = (await youtubeApi.getChannelStatistics(streamer.youtubeId)).data.items[0].statistics

          if (!statistics.hiddenSubscriberCount) {
            Follower.create({
              streamId: createdStream[0].id,
              count: statistics.subscriberCount
            })
          }
        }
      }
    } catch (error) {
      logger.error(error)
      throw error
    }
  },

  async fetchCurrentStreams (req, res) {
    try {
      const streams = await Stream.findAll({
        include: {
          model: Streamer,
          where: {
            youtubeId: {
              [Op.not]: null
            }
          }
        },
        where: {
          finishedAt: null
        }
      })

      for (const stream of streams) {
        const videoDetails = (await youtubeApi.getVideoDetails(stream.externalId)).data.items[0]
        if (videoDetails.liveStreamingDetails.actualEndTime) {
          await Stream.update({
            finishedAt: videoDetails.liveStreamingDetails.actualEndTime,
            duration: sequelize.literal(`((UNIX_TIMESTAMP(finishedAt) - UNIX_TIMESTAMP(startedAt))/3600)`)
          }, {
            where: {
              id: stream.id
            }
          })
        }

        let count = 0
        if (videoDetails.liveStreamingDetails.concurrentViewers) {
          count = videoDetails.liveStreamingDetails.concurrentViewers
        }

        Viewer.create({
          streamId: stream.id,
          count: count
        })

        const statistics = (await youtubeApi.getChannelStatistics(stream.Streamer.youtubeId)).data.items[0].statistics
        if (!statistics.hiddenSubscriberCount) {
          Follower.create({
            streamId: stream.id,
            count: statistics.subscriberCount
          })
        }
      }
    } catch (error) {
      logger.error(error)
      throw error
    }
  }
}
