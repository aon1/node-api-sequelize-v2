const { Stream, Streamer, Game, Viewer, Follower } = require('../models')
const sequelize = require('sequelize')
const pagination = require('../services/pagination')

module.exports = {
  index (req, res) {
    return Stream.findAll()
      .then(streams => {
        res.status(200).json(streams)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findByStreamerId (req, res) {
    const streamerId = req.params.streamerId

    return Stream.findAll({
      attributes: [ 'gameId', 'startedAt', 'finishedAt', 'duration' ],
      where: {
        streamerId: streamerId
      }
    })
      .then(stream => {
        res.status(200).json(stream)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findByGameId (req, res) {
    const gameId = req.params.gameId

    return Stream.findAll({
      attributes: [ 'streamerId', 'startedAt', 'finishedAt', 'duration' ],
      where: {
        gameId: gameId
      },
      include: [
        { model: Streamer, attributes: { exclude: [ 'id', 'createdAt', 'updatedAt' ] } },
        { model: Viewer, attributes: { exclude: [ 'id', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'createdAt', 'updatedAt' ] } }
      ]
    })
      .then(stream => {
        res.status(200).json(stream)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchStreamByGames (req, res) {
    const { page, size } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    return Game.findAndCountAll({
      subQuery: false,
      attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
      include: [
        { model: Stream,
          attributes: {
            include: [
              [ sequelize.literal(`(SELECT AVG(count) FROM viewers WHERE streamId = Streams.id) / duration`), 'averageViewersPerHour' ],
              [ sequelize.literal(`(SELECT AVG(count) FROM followers WHERE streamId = Streams.id) / duration`), 'averageFollowersPerHour' ],
              [ sequelize.literal(`(SELECT MAX(count) FROM viewers WHERE streamId = Streams.id)`), 'maxViewers' ],
              [ sequelize.literal(`(SELECT MAX(count) FROM followers WHERE streamId = Streams.id)`), 'maxFollowers' ]
            ],
            exclude: [ 'id', 'createdAt', 'updatedAt', 'gameId', 'GameId', 'StreamerId' ]
          },
          include: [
            { model: Streamer, attributes: { exclude: [ 'id', 'createdAt', 'updatedAt' ] } },
            { model: Viewer, attributes: { exclude: [ 'id', 'count', 'createdAt', 'updatedAt', 'StreamId', 'streamId' ] } },
            { model: Follower, attributes: { exclude: [ 'id', 'count', 'createdAt', 'updatedAt', 'StreamId', 'streamId' ] } }
          ]
        }
      ],
      group: [ 'id' ],
      limit: limit,
      offset: offset
    })
      .then(streams => {
        const response = pagination.getPagingDataAggregated(streams, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  async fetchStreamDetails (req, res) {
    const id = req.params.id

    return Stream.findAll({
      attributes: [
        'streamerId',
        'startedAt',
        'finishedAt',
        'duration',
        [ sequelize.literal(`(SELECT MAX(count) FROM viewers WHERE streamId = Stream.id)`), 'maxViewers' ],
        [ sequelize.literal(`(SELECT MAX(count) FROM followers WHERE streamId = Stream.id)`), 'maxFollowers' ],
        [ sequelize.literal(`(SELECT AVG(count) FROM viewers WHERE streamId = Stream.id) / duration`), 'averageViewersPerHour' ],
        [ sequelize.literal(`(SELECT AVG(count) FROM followers WHERE streamId = Stream.id) / duration`), 'averageFollowersPerHour' ],
        [ sequelize.literal(`((SELECT count FROM followers WHERE streamId = 1 ORDER BY id DESC LIMIT 1) - 
          (SELECT count FROM followers where streamId = 1 ORDER BY id LIMIT 1)) / duration`), 'followersGainPerHour' ],
        [ sequelize.literal(`(SELECT AVG(count) FROM viewers WHERE streamId = Stream.id) * duration`), 'hoursWatched' ],
        [ sequelize.literal(`(SELECT SUM(count) FROM viewers WHERE streamId = Stream.id) / duration`), 'averageConcurrentViewers' ]
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
