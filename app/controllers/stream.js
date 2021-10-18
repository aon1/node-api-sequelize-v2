const { Stream, Game, Viewer, Follower } = require('../models')
const sequelize = require('sequelize')

module.exports = {

  async fetchStreamDetails (req, res) {
    const id = req.params.id

    return Stream.findAll({
      attributes: [
        'streamerId',
        'startedAt',
        'finishedAt',
        'duration',
        [ sequelize.literal(`(SELECT MAX(count) FROM Viewers WHERE streamId = Stream.id)`), 'maxViewers' ],
        [ sequelize.literal(`(SELECT MAX(count) FROM Followers WHERE streamId = Stream.id)`), 'maxFollowers' ],
        [ sequelize.literal(`(SELECT AVG(count) FROM Viewers WHERE streamId = Stream.id) / duration`), 'averageViewersPerHour' ],
        [ sequelize.literal(`(SELECT AVG(count) FROM Followers WHERE streamId = Stream.id) / duration`), 'averageFollowersPerHour' ],
        [ sequelize.literal(`((SELECT count FROM Followers WHERE streamId = Stream.id ORDER BY id DESC LIMIT 1) - 
          (SELECT count FROM Followers where streamId = Stream.id ORDER BY id LIMIT 1)) / duration`), 'followersGainPerHour' ],
        [ sequelize.literal(`(SELECT AVG(count) FROM Viewers WHERE streamId = Stream.id) * duration`), 'hoursWatched' ],
        [ sequelize.literal(`(SELECT SUM(count) FROM Viewers WHERE streamId = Stream.id) / duration`), 'averageConcurrentViewers' ]
      ],
      where: {
        id: id
      },
      include: [
        { model: Game, attributes: { exclude: [ 'createdAt', 'updatedAt' ] } },
        { model: Viewer, attributes: { include: [ 'createdAt' ], exclude: [ 'streamId', 'StreamId', 'updatedAt' ] } },
        { model: Follower, attributes: { include: [ 'createdAt' ], exclude: [ 'streamId', 'StreamId', 'updatedAt' ] } }
      ]
    })
      .then(stream => {
        res.status(200).json(stream)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  async create (req, res) {
    const data = req.body

    return Stream.create(data)
      .then(stream => {
        res.status(200).json({
          status: 200,
          message: 'Stream created',
          data: { stream: stream.id }
        })
      })
      .catch(error => {
        console.error('Error on creating stream', error)
        res.status(500).json({ message: 'Error on creating stream' })
      })
  }
}
