const express = require('express')
const router = express.Router()

const controller = require('../controllers/follower')

router.get('/', controller.index)
router.get('/:streamerId', controller.findByStreamerId)
router.post('/', controller.create)

module.exports = router
