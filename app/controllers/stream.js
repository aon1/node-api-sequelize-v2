const { Stream, Streamer, Game } = require('../models')

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
      attributes: [ 'gameId', 'startedAt', 'finishedAt', 'hourCount' ],
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
      attributes: [ 'streamerId', 'startedAt', 'finishedAt', 'hourCount' ],
      where: {
        gameId: gameId
      },
      include: [ { model: Streamer, attributes: { exclude: [ 'id', 'createdAt', 'updatedAt' ] } } ]
    })
      .then(stream => {
        res.status(200).json(stream)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findLastStreamByStreamer (req, res) {
    const streamerId = req.params.streamerId

    return Stream.findOne({
      attributes: [ 'startedAt', 'finishedAt', 'hourCount' ],
      where: {
        streamerId: streamerId
      },
      include: [ { model: Game, attributes: [ 'name' ] } ],
      order: [ [ 'finishedAt', 'DESC' ] ]
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

    // const game = await Game.findByPk(data.gameId)
    // const streamer = await Streamer.findByPk(data.streamerId)
    // {
    //   streamerId: data.streamerId,
    //     gameId: data.gameId
    // }, {
    //   include: [ Streamer, Game ]
    // }

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
