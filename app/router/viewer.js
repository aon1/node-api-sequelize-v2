const express = require('express')
const router = express.Router()

const controller = require('../controllers/viewer')

router.get('/stream/:streamId', controller.findByStreamId)
router.post('/', controller.create)

module.exports = router
