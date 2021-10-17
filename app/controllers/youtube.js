const { Streamer, Stream, Game, Viewer, Follower } = require('../models')
const youtubeApi = require('../services/youtube')
const sequelize = require('sequelize')
const twitchApi = require('../services/twitch')

module.exports = {
  async fetchStreamsJob (req, res) {
    try {
      const streamers = await Streamer.findAll({
        where: {
          site: 'youtube'
        }
      })

      const streamersMap = new Map(streamers.map(i => [i.externalId, i]))

      for (const streamer of streamers) {
        const streams = await youtubeApi.getStreams(streamer.externalId)

        for (const st of streams.data.items) {
          console.log('#######')
          console.log(streamer.name)
          console.log(st.id.videoId)
          console.log('#######')

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
              gameId: 1
            }
          })

          Viewer.create({
            streamId: createdStream[0].id,
            count: videoDetails.liveStreamingDetails.concurrentViewers
          })

          const statistics = (await youtubeApi.getChannelStatistics(streamer.externalId)).data.items[0].statistics
          console.log('###### statistics')
          console.log(statistics)
          console.log('######')

          if (!statistics.hiddenSubscriberCount) {
            Follower.create({
              streamId: createdStream[0].id,
              count: statistics.subscriberCount
            })
          }
        }
      }
    } catch (error) {
      return res.status(error.code).json({ message: error.errors })
    }
  },

  async fetchCurrentStreams (req, res) {
    try {
      const streams = await Stream.findAll({
        include: { model: Streamer, where: { site: 'youtube' } },
        where: {
          finishedAt: null
        }
      })

      for (const stream of streams) {
        const videoDetails = (await youtubeApi.getVideoDetails(stream.externalId)).data.items[0]
        if (videoDetails.liveStreamingDetails.actualEndTime) {
          console.log('essa stream terminou ' + stream.externalId)
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

        const statistics = (await youtubeApi.getChannelStatistics(stream.Streamer.externalId)).data.items[0].statistics
        // console.log('###### statistics')
        // console.log(statistics)
        // console.log('######')

        if (!statistics.hiddenSubscriberCount) {
          Follower.create({
            streamId: stream.id,
            count: statistics.subscriberCount
          })
        }
      }
    } catch (error) {
      console.log(error)
      return res.status(error.code).json({ message: error.errors })
    }
  },

  async fetchTopGamesJob (req, res) {
    let filter = { limit: 100 }
    let cursor = null

    do {
      const games = await twitchApi.getTopGames(filter)
      for (const game of games.data) {
        Game.findOrCreate({
          where: {
            twitchId: game.id
          },
          defaults: {
            twitchId: game.id,
            name: game.name,
            boxArtUrl: game.boxArtUrl
          }
        }).then(created => {
          // console.log(created)
        })
      }

      cursor = games.cursor
      if (cursor) {
        filter['after'] = cursor
      }

      await new Promise(resolve => setTimeout(resolve, 5000))
    } while (cursor !== undefined)

    res.status(200).json([])
  },

  async streamHasFinishedJob (req, res) {
    Stream.findAll({
      include: { model: Streamer, where: { site: 'twitch' } },
      where: {
        finishedAt: null
      }
    })
      .then(async streams => {
        // const streamsMap = new Map(streams.map(i => [i.externalId, i]))
        const userNames = []
        streams.forEach(stream => userNames.push(stream.Streamer.login))

        const twitchStreams = await twitchApi.getStreams({ userName: userNames })
        const twitchStreamsMap = new Map(twitchStreams.data.map(i => [i.id, i]))

        for (const stream of streams) {
          if (!twitchStreamsMap.get(stream.externalId)) {
            console.log('essa stream nao veio ' + stream.Streamer.login)
            Stream.update({
              finishedAt: sequelize.fn('NOW'),
              duration: sequelize.literal(`((SELECT UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(startedAt))/3600)`)
            }, {
              where: {
                id: stream.id
              },
              individualHooks: true
            })
          } else {
            console.log('essa stream veio ' + stream.Streamer.login)
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
