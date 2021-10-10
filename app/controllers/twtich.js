const { Streamer, Stream, Game, Viewer, Follower } = require('../models')
const pagination = require('../services/pagination')
const twitchApi = require('../services/twitch')

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
                res.status(200).json([])
              }

              console.log(streams)

              streams.data.forEach(s => {
                Game.findOne({
                  where: {
                    name: s.gameName
                  }
                }).then(game => {
                  Stream.findOrCreate({
                    where: {
                      externalStreamId: s.id
                    },
                    defaults: {
                      streamerId: streamersMap.get(s.userName).id,
                      externalStreamId: s.id,
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

              res.status(200).json([])
            })
            .catch(error => {
              res.status(500).json({ status: 500, message: error })
            })

          cursor = streamers.cursor
          if (cursor) {
            filter.set('after', cursor)
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
            name: game.name
          },
          defaults: {
            name: game.name,
            boxArtUrl: game.boxArtUrl
          }
        }).then(created => {
          // console.log(created)
        })
      }

      cursor = games.cursor
      if (cursor) {
        filter.set('after', cursor)
      }

      await new Promise(resolve => setTimeout(resolve, 5000))
    } while (cursor !== undefined)

    res.status(200).json([])
  }
}
