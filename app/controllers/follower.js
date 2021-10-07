const { Follower } = require('../models')

module.exports = {
  index (req, res) {
    return Follower.findAll()
      .then(followers => {
        res.status(200).json(followers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findByStreamerId (req, res) {
    const streamerId = req.params.streamerId

    return Follower.findAll({
      attributes: [ 'count', 'createdAt' ],
      where: {
        streamerId: streamerId
      }
    })
      .then(follower => {
        res.status(200).json(follower)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  create (req, res) {
    const data = req.body

    return Follower.create(data)
      .then(follower => {
        res.status(200).json({
          status: 200,
          message: 'Follower created',
          data: { follower: follower.id }
        })
      })
      .catch(error => {
        console.error('Error on creating follower', error)
        res.status(500).json({ message: 'Error on creating follower' })
      })
  }
}
