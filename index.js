const express = require('express')
const app = express()
const router = require('./app/router/')
const port = require('./config/config')
const scheduler = require('./app/services/cron')

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', router)

// app.use(function (err, req, res, next) {
//   if (err.isBoom) {
//     return res.status(err.output.statusCode).json(err.output.payload)
//   }
// })

// scheduler.schedule('controller.fetchStreams')

// const port = process.env.PORT || 3000
app.listen(port.PORT, () => {
  console.log(`Node server listening on port ${port.PORT}`)
})
