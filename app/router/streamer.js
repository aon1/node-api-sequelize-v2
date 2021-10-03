const express = require('express')
const router = express.Router()

const controller = require('../controllers/streamer')

router.get('/', controller.index)
router.get('/:id', controller.findById)
router.get('/:id/followers', controller.fetchFollowers)
router.get('/:id/last-stream', controller.fetchLastStream)
router.get('/:id/average-viewers/:period', controller.fetchAverageViewers)
router.get('/:id/average-followers/:period', controller.fetchAverageFollowers)
router.get('/:id/games', controller.fetchGamesStreamed)
router.get('/:id/hours-streamed/:period', controller.fetchHoursStreamedByPeriod)
router.get('/:id/followers/:period', controller.fetchFollowersByPeriod)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
