const express = require('express')
const router = express.Router()

const controller = require('../controllers/twtich')

// router.get('/top-games', controller.fetchTopGames)
router.get('/streams/:login', controller.fetchStream)
router.get('/streams', controller.fetchStreams)

module.exports = router
