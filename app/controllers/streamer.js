const { Streamer } = require('../models')

module.exports = {
  index (req, res) {
    console.log(Streamer.findAll())
    return Streamer.findAll()
      .then(users => {
        res.status(200).json(users)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
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
        console.error('Error on creating client', error)
        res.status(500).json({ message: 'Error on creating user' })
      })
  },

  update (req, res) {
    const data = req.body
    const userId = req.params.userId

    return Streamer.update(data, { where: { id: userId }, individualHooks: true })
      .then(result => {
        res.status(200).json({ status: 200, message: 'User updated' })
      })
      .catch(error => {
        console.error('Error on updating User', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on updating User' })
      })
  },

  delete (req, res) {
    const userId = req.params.userId

    return Streamer.destroy({ where: { id: userId } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          return res
            .status(404)
            .json({ status: 404, message: 'User not found' })
        } else if (affectedRows === 1) {
          return res.status(200).json({ status: 200, message: 'User deleted' })
        } else {
          return Promise.reject(
            new Error('Unexpected error. Wront ammount deletion of User')
          )
        }
      })
      .catch(error => {
        console.error('Error on deleting User', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on deleting User' })
      })
  }
}
