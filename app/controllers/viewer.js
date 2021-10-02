const { Viewer } = require('../models')

module.exports = {
  findByStreamId (req, res) {
    const streamId = req.params.streamId

    return Viewer.findAll({
      attributes: [ 'count', 'createdAt' ],
      where: {
        streamId: streamId
      }
    })
      .then(viewers => {
        res.status(200).json(viewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  create (req, res) {
    const data = req.body

    return Viewer.create(data)
      .then(viewer => {
        res.status(200).json({
          status: 200,
          message: 'Viewer created',
          data: { viewer: viewer.id }
        })
      })
      .catch(error => {
        console.error('Error on creating viewer', error)
        res.status(500).json({ message: 'Error on creating viewer' })
      })
  }
}
