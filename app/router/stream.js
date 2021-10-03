const express = require('express')
const router = express.Router()

const controller = require('../controllers/stream')

router.get('/', controller.index)
router.get('/streamer/:streamerId', controller.findByStreamerId)
router.get('/game/:gameId', controller.findByGameId)
router.get('/:id/details', controller.fetchStreamDetails)
router.get('/:id/cumulative-viewers', controller.fetchCumulativeViewerCount)
router.get('/:id/cumulative-followers', controller.fetchCumulativeFollowerCount)
router.get('/:id/details', controller.fetchStreamDetails)
router.post('/', controller.create)

module.exports = router
