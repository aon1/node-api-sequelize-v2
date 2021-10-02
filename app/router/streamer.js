const express = require('express')
const router = express.Router()

const controller = require('../controllers/streamer')

router.get('/', controller.index)

// create user
router.post('/', controller.create)

module.exports = router
