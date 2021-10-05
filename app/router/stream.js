const express = require('express')
const router = express.Router()

const controller = require('../controllers/stream')

router.get('/', controller.index)
router.get('/streamer/:streamerId', controller.findByStreamerId)
router.get('/game/:gameId', controller.findByGameId)
router.get('/games', controller.fetchStreamByGames)
router.get('/:id/details', controller.fetchStreamDetails)
router.post('/', controller.create)

module.exports = router
