const { Game } = require('../models')
const pagination = require('../services/pagination')

module.exports = {
  index (req, res) {
    const { page, size } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    return Game.findAndCountAll({
      limit: limit,
      offset: offset
    })
      .then(games => {
        const response = pagination.getPagingData(games, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findById (req, res) {
    const id = req.params.id

    return Game.findByPk(id)
      .then(game => {
        res.status(200).json(game)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  create (req, res) {
    const data = req.body

    return Game.create(data)
      .then(game => {
        res.status(200).json({
          status: 200,
          message: 'Game created',
          data: { game: game.id }
        })
      })
      .catch(error => {
        console.error('Error on creating game', error)
        res.status(500).json({ message: 'Error on creating game' })
      })
  },

  update (req, res) {
    const data = req.body
    const id = req.params.id

    return Game.update(data, { where: { id: id }, individualHooks: true })
      .then(result => {
        res.status(200).json({ status: 200, message: 'Game updated' })
      })
      .catch(error => {
        console.error('Error on updating game', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on updating game' })
      })
  },

  delete (req, res) {
    const id = req.params.id

    return Game.destroy({ where: { id: id } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          return res
            .status(404)
            .json({ status: 404, message: 'Game not found' })
        } else if (affectedRows === 1) {
          return res.status(200).json({ status: 200, message: 'Game deleted' })
        } else {
          return Promise.reject(
            new Error('Unexpected error. Wrong amount deletion of game')
          )
        }
      })
      .catch(error => {
        console.error('Error on deleting game', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on deleting game' })
      })
  }
}
