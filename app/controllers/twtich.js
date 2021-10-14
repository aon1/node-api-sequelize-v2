const { Streamer, Stream, Game, Viewer, Follower } = require('../models')
const pagination = require('../services/pagination')
const twitchApi = require('../services/twitch')
const sequelize = require('sequelize')

module.exports = {
  fetchStreamsJob (req, res) {
    let filter = { limit: 100 }
    let cursor = null

    Streamer.findAll({
      where: {
        site: 'twitch'
      },
      limit: 100
    })
      .then(async streamers => {
        const streamersMap = new Map(streamers.map(i => [i.login, i]))
        const userNames = []
        streamers.forEach(streamer => userNames.push(streamer.login))

        do {
          await twitchApi.getStreams({ userName: userNames })
            .then(streams => {
              if (!streams) {
                return res.status(200).json([])
              }

              streams.data.forEach(s => {
                Game.findOne({
                  where: {
                    twitchId: s.gameId
                  }
                }).then(game => {
                  Stream.findOrCreate({
                    where: {
                      externalId: s.id
                    },
                    defaults: {
                      streamerId: streamersMap.get(s.userName).id,
                      externalId: s.id,
                      startedAt: s.startDate,
                      gameId: game.id
                    }
                  }).then(async created => {
                    Viewer.create({
                      streamId: created[0].id,
                      count: s.viewers
                    })

                    const followers = await twitchApi.getFollowers({ followedUser: streamersMap.get(s.userName).externalId })
                    Follower.create({
                      streamId: created[0].id,
                      count: followers.total
                    })
                  })
                })
              })
            })
            .catch(error => {
              res.status(500).json({ status: 500, message: error })
            })

          cursor = streamers.cursor
          if (cursor) {
            filter['after'] = cursor
          }

          await new Promise(resolve => setTimeout(resolve, 5000))
        } while (cursor !== undefined)
      })
      .catch(error => {
        console.log(error)
      })

    res.status(200).json([])
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
