const express = require('express')
const router = express.Router()

const controller = require('../controllers/stream')

router.get('/', controller.index)
router.get('/streamer/:streamerId', controller.findByStreamerId)
router.get('/game/:gameId', controller.findByGameId)
router.get('/last-stream/:streamerId', controller.findLastStreamByStreamer)
router.post('/', controller.create)

module.exports = router
