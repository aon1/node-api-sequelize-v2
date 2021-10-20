const express = require('express')
const router = express.Router()

const controller = require('../controllers/stream')

router.get('/:id/details', controller.fetchStreamDetails)
router.get('/:id/more-information', controller.moreInformation)
router.post('/', controller.create)

module.exports = router
