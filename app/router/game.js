const express = require('express')
const router = express.Router()

const controller = require('../controllers/game')

router.get('/', controller.index)
router.get('/:id', controller.findById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
