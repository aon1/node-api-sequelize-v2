const { Streamer, Stream, Game, Viewer, Follower } = require('../models')
const twitchApi = require('../services/twitch')
const sequelize = require('sequelize')

module.exports = {
  async fetchStreamsJob (req, res) {
    let filter = { limit: 100 }
    let cursor = null
    let offset = 0
    let batchSize = 100

    console.log('fetchStreamsJob started')
    try {
      do {
        const streamers = await Streamer.findAll({
          where: {
            site: 'twitch'
          },
          limit: 100,
          offset: offset
        })

        if (streamers.length === 0) {
          break
        }

        console.log('offset')
        console.log(offset)
        console.log('offset')

        const streamersMap = new Map(streamers.map(i => [i.login, i]))
        const userNames = []
        streamers.forEach(streamer => userNames.push(streamer.login))

        do {
          const streams = await twitchApi.getStreams({ userName: userNames })
          for (const s of streams.data) {
            const game = await Game.findOne({
              where: {
                twitchId: s.gameId
              }
            })

            const created = await Stream.findOrCreate({
              where: {
                externalId: s.id
              },
              defaults: {
                streamerId: streamersMap.get(s.userName).id,
                externalId: s.id,
                startedAt: s.startDate,
                gameId: game.id
              }
            })

            Viewer.create({
              streamId: created[0].id,
              count: s.viewers
            })

            const followers = await twitchApi.getFollowers({ followedUser: streamersMap.get(s.userName).externalId })
            Follower.create({
              streamId: created[0].id,
              count: followers.total
            })
          }

          cursor = streamers.cursor
          if (cursor) {
            filter['after'] = cursor
          }

          await new Promise(resolve => setTimeout(resolve, 5000))
        } while (cursor !== undefined)
        offset += batchSize
      } while (true)
      console.log('fetchStreamsJob finished')
    } catch (error) {
      throw error
    }
  },

  async fetchTopGamesJob (req, res) {
    let filter = { limit: 100 }
    let cursor = null

    console.log('fetchTopGamesJob started')
    try {
      do {
        const games = await twitchApi.getTopGames(filter)
        for (const game of games.data) {
          await Game.findOrCreate({
            where: {
              twitchId: game.id
            },
            defaults: {
              twitchId: game.id,
              name: game.name,
              boxArtUrl: game.boxArtUrl
            }
          })
        }

        cursor = games.cursor
        if (cursor) {
          filter['after'] = cursor
        }

        await new Promise(resolve => setTimeout(resolve, 5000))
      } while (cursor !== undefined)
    } catch (error) {
      throw error
    }

    console.log('fetchTopGamesJob finished')
  },

  async streamHasFinishedJob (req, res) {
    console.log('streamHasFinishedJob started')
    try {
      const streams = await Stream.findAll({
        include: { model: Streamer, where: { site: 'twitch' } },
        where: {
          finishedAt: null
        }
      })

      const userNames = []
      streams.forEach(stream => userNames.push(stream.Streamer.login))

      const twitchStreams = await twitchApi.getStreams({ userName: userNames })
      const twitchStreamsMap = new Map(twitchStreams.data.map(i => [i.id, i]))

      for (const stream of streams) {
        if (!twitchStreamsMap.get(stream.externalId)) {
          console.log('Stream has finished ' + stream.Streamer.login)
          Stream.update({
            finishedAt: sequelize.fn('NOW'),
            duration: sequelize.literal(`((SELECT UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(startedAt))/3600)`)
          }, {
            where: {
              id: stream.id
            },
            individualHooks: true
          })
        }
      }
    } catch (error) {
      throw error
    }

    console.log('streamHasFinishedJob finished')
  }
}
