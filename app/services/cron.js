const cron = require('node-cron')
const twitch = require('../controllers/twtich')
const youtube = require('../controllers/youtube')
const config = require('../../config/config')
const { logger } = require('../services/logger')

module.exports = {
  schedule () {
    cron.schedule(config.CRON_EXPRESSION_UPDATE_STREAMS_TWITCH, () => {
      logger.info('running twitch fetchStreams job')
      twitch.fetchStreamsJob()
    })

    cron.schedule(config.CRON_EXPRESSION_CHECK_STREAM_IS_FINISHED_TWITCH, () => {
      logger.info('running twitch streamHasFinishedJob job')
      twitch.streamHasFinishedJob()
    })

    cron.schedule(config.CRON_EXPRESSION_UPDATE_STREAMS_YOUTUBE, () => {
      logger.info('running youtube currentStreams job')
      youtube.fetchCurrentStreams()
    })

    cron.schedule(config.CRON_EXPRESSION_CHECK_STREAM_IS_FINISHED_YOUTUBE, () => {
      logger.info('running youtube fetchStreams job')
      youtube.fetchStreamsJob()
    })
  }
}
