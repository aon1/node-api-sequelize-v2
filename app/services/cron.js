const cron = require('node-cron')
const controller = require('../controllers/twtich')
const config = require('../../config/config')

module.exports = {
  schedule () {
    cron.schedule(config.CRON_EXPRESSION_UPDATE_STREAMS, () => {
      controller.fetchStreamsJob()
      // if (task === 'controller.fetchStreams') {
      //   controller.fetchStreams()
      // }

      console.log('running fetchStreams job')
    })

    cron.schedule(config.CRON_EXPRESSION_CHECK_STREAM_IS_FINISHED, () => {
      controller.streamHasFinishedJob()
      // if (task === 'controller.fetchStreams') {
      //   controller.fetchStreams()
      // }

      console.log('running streamHasFinishedJob job')
    })
  }
}
