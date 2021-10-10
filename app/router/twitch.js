const express = require('express')
const router = express.Router()

const controller = require('../controllers/twtich')

router.get('/top-games', controller.fetchTopGamesJob)
router.get('/streams', controller.fetchStreamsJob)

module.exports = router
