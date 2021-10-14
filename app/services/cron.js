const cron = require('node-cron')
const controller = require('../controllers/twtich')

module.exports = {
  schedule () {
    cron.schedule('*/30 * * * *', () => {
      controller.fetchStreamsJob()
      // if (task === 'controller.fetchStreams') {
      //   controller.fetchStreams()
      // }

      console.log('running fetchStreams job')
    })

    cron.schedule('*/35 * * * *', () => {
      controller.streamHasFinishedJob()
      // if (task === 'controller.fetchStreams') {
      //   controller.fetchStreams()
      // }

      console.log('running streamHasFinishedJob job')
    })
  }
}
