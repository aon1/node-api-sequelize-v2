const sequelize = require('sequelize')
const twitchApi = require('../services/twitch')
const { Streamer, Stream, Game, Viewer, Follower } = require('../models')
const { logger } = require('../services/logger')
const { Op } = require('sequelize')

module.exports = {
  async fetchStreamsJob (req, res) {
    let filter = { limit: 100 }
    let cursor = null
    let offset = 0
    let batchSize = 100

    logger.info('twitch fetchStreamsJob started')
    try {
      do {
        const streamers = await Streamer.findAll({
          where: {
            twitchId: {
              [Op.not]: null
            }
          },
          limit: 100,
          offset: offset
        })

        if (streamers.length === 0) {
          break
        }

        const streamersMap = new Map(streamers.map(i => [i.twitchId, i]))
        const usersId = []
        streamers.forEach(streamer => usersId.push(streamer.twitchId))

        do {
          const streams = await twitchApi.getStreams({ userId: usersId })
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
                streamerId: streamersMap.get(s.userId).id,
                externalId: s.id,
                startedAt: s.startDate,
                gameId: game.id,
                site: 'twitch'
              }
            })

            Viewer.create({
              streamId: created[0].id,
              count: s.viewers
            })

            const followers = await twitchApi.getFollowers({ followedUser: streamersMap.get(s.userId).twitchId })
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
      logger.info('twitch fetchStreamsJob finished')
    } catch (error) {
      throw error
    }
  },

  async fetchTopGamesJob (req, res) {
    let filter = { limit: 100 }
    let cursor = null

    logger.info('twitch fetchTopGamesJob started')
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

    logger.info('twitch fetchTopGamesJob finished')
  },

  async streamHasFinishedJob (req, res) {
    logger.info('twitch streamHasFinishedJob started')
    try {
      const streams = await Stream.findAll({
        include: {
          model: Streamer,
          where: {
            twitchId: {
              [Op.not]: null
            }
          }
        },
        where: {
          finishedAt: null
        }
      })

      const usersId = []
      streams.forEach(stream => usersId.push(stream.Streamer.twitchId))

      const twitchStreams = await twitchApi.getStreams({ userId: usersId })
      const twitchStreamsMap = new Map(twitchStreams.data.map(i => [i.id, i]))

      for (const stream of streams) {
        if (!twitchStreamsMap.get(stream.externalId)) {
          logger.info('Stream has finished ' + stream.Streamer.name)
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

    logger.info('twitch streamHasFinishedJob finished')
  }
}
