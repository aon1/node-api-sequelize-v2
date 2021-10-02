const express = require('express')
const router = express.Router()

const streamer = require('./streamer')

router.use('/streamers', streamer)

module.exports = router
