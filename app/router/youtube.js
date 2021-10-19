const express = require('express')
const router = express.Router()

const controller = require('../controllers/youtube')

router.get('/streams', controller.fetchStreamsJob)
router.get('/current-streams', controller.fetchCurrentStreams)

module.exports = router
