const { StaticAuthProvider } = require('@twurple/auth')
const { ApiClient } = require('@twurple/api')
const { Streamer, Stream, Game, Viewer } = require('../models')
const pagination = require('../services/pagination')

const clientId = 'swwil2q0f6x7qvy4bia372dl8cv9l7'
const accessToken = '99a4hhuw3mu8qjtmed5q739n9t9l02'

const authProvider = new StaticAuthProvider(clientId, accessToken)
const apiClient = new ApiClient({ authProvider })

module.exports = {
  fetchStream (req, res) {
    const login = req.params.login

    apiClient.streams.getStreamByUserName(login)
      .then(stream => {
        if (!stream) {
          res.status(200).json([])
        }

        console.log(stream)
        res.status(200).json(stream.viewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchStreams (req, res) {
    Streamer.findAll({
      where: {
        site: 'twitch'
      },
      limit: 100
    })
      .then(streamers => {
        const streamersMap = new Map(streamers.map(i => [ i.login, i ]))
        const userNames = []
        streamers.forEach(streamer => userNames.push(streamer.login))
        apiClient.streams.getStreams({ userName: userNames })
          .then(streams => {
            if (!streams) {
              res.status(200).json([])
            }

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
                }).then(created => {
                  Viewer.create({
                    streamId: created[0].id,
                    count: s.viewers
                  })
                })
              })
            })

            res.status(200).json([])
          })
          .catch(error => {
            res.status(500).json({ status: 500, message: error })
          })
      })
      .catch(error => {
        console.log(error)
      })
  },

  fetchTopGames (req, res) {
    // const gameOptions = {
    //   url: 'https://api.twitch.tv/helix/games/top',
    //   method: 'GET',
    //   headers: {
    //     'Client-ID': 'swwil2q0f6x7qvy4bia372dl8cv9l7',
    //     'Authorization': 'Bearer ' + '99a4hhuw3mu8qjtmed5q739n9t9l02'
    //   }
    // }
    //
    // request.get(gameOptions, (err, response, body) => {
    //   if (err) {
    //     return console.log(err)
    //   }
    //
    //   console.log(`Status: ${response.statusCode}`)
    //   console.log(JSON.parse(body))
    //   return res.status(200).json(JSON.parse(body))
    // })
  }
}
