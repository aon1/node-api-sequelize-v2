const cron = require('node-cron')
const controller = require('../controllers/twtich')
const config = require('../../config/config')
const { logger } = require('../services/logger')

module.exports = {
  schedule () {
    cron.schedule(config.CRON_EXPRESSION_UPDATE_STREAMS, () => {
      logger.info('running fetchStreams job')
      controller.fetchStreamsJob()
    })

    cron.schedule(config.CRON_EXPRESSION_CHECK_STREAM_IS_FINISHED, () => {
      logger.info('running streamHasFinishedJob job')
      controller.streamHasFinishedJob()
    })
  }
}
