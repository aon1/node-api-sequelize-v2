const express = require('express')
const router = express.Router()

const streamer = require('./streamer')
const game = require('./game')
const stream = require('./stream')
const follower = require('./follower')
const viewer = require('./viewer')
const twitch = require('./twitch')

router.use('/streamers', streamer)
router.use('/games', game)
router.use('/streams', stream)
router.use('/followers', follower)
router.use('/viewers', viewer)
router.use('/twitch', twitch)

module.exports = router
