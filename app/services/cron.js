const cron = require('node-cron')
const controller = require('../controllers/twtich')

module.exports = {
  schedule (task) {
    cron.schedule('* * * * *', () => {
      // if (task === 'controller.fetchStreams') {
      //   controller.fetchStreams()
      // }

      console.log('running every minute 1, 2, 4 and 5')
    })
  }
}
