const express = require('express')
const router = express.Router()

const controller = require('../controllers/youtube')

router.get('/streams', controller.fetchStreamsJob)
router.get('/current-streams', controller.fetchCurrentStreams)
// router.get('/top-games', controller.fetchTopGamesJob)
// router.get('/stream-has-finished', controller.streamHasFinishedJob)

module.exports = router
