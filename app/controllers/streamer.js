const { Streamer, Follower, Stream, Game, Viewer } = require('../models')

module.exports = {
  index (req, res) {
    return Streamer.findAll()
      .then(streamers => {
        res.status(200).json(streamers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findById (req, res) {
    const id = req.params.id

    return Streamer.findByPk(id)
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchFollowers (req, res) {
    const id = req.params.id

    return Follower.findOne({
      attributes: [ 'count' ],
      where: {
        streamerId: id
      },
      order: [ [ 'createdAt', 'DESC' ] ]
    })
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchLastStream (req, res) {
    const id = req.params.id

    return Stream.findOne({
      attributes: { exclude: [ 'streamerId', 'gameId', 'StreamerId', 'GameId' ] },
      where: {
        streamerId: id
      },
      include: [ { model: Game, attributes: { exclude: [ 'createdAt', 'updatedAt' ] } } ],
      order: [ [ 'startedAt', 'DESC' ] ]
    })
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  async fetchAverageViewers (req, res) {
    const id = req.params.id
    const period = req.params.period

    const streams = await Stream.findAll({
      where: {
        streamerId: id
      }
    })

    console.log(streams)

    // return Stream.findOne({
    //   attributes: { exclude: ['streamerId', 'gameId', 'StreamerId', 'GameId'] },
    //   where: {
    //     streamerId: id
    //   },
    //   include: [{ model: Game, attributes: { exclude: ['createdAt', 'updatedAt'] } }],
    //   order: [['startedAt', 'DESC']]
    // })
    //   .then(streamer => {
    //     res.status(200).json(streamer)
    //   })
    //   .catch(error => {
    //     res.status(500).json({ status: 500, message: error })
    //   })
  },

  create (req, res) {
    const data = req.body

    return Streamer.create(data)
      .then(streamer => {
        res.status(200).json({
          status: 200,
          message: 'Streamer created',
          data: { streamer: streamer.id }
        })
      })
      .catch(error => {
        console.error('Error on creating streamer', error)
        res.status(500).json({ message: 'Error on creating streamer' })
      })
  },

  update (req, res) {
    const data = req.body
    const id = req.params.id

    return Streamer.update(data, { where: { id: id }, individualHooks: true })
      .then(result => {
        res.status(200).json({ status: 200, message: 'Streamer updated' })
      })
      .catch(error => {
        console.error('Error on updating streamer', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on updating streamer' })
      })
  },

  delete (req, res) {
    const id = req.params.id

    return Streamer.destroy({ where: { id: id } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          return res
            .status(404)
            .json({ status: 404, message: 'Streamer not found' })
        } else if (affectedRows === 1) {
          return res.status(200).json({ status: 200, message: 'Streamer deleted' })
        } else {
          return Promise.reject(
            new Error('Unexpected error. Wrong amount deletion of streamer')
          )
        }
      })
      .catch(error => {
        console.error('Error on deleting streamer', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on deleting streamer' })
      })
  }
}
