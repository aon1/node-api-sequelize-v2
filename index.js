const express = require('express')
const winston = require('winston')
const expressWinston = require('express-winston')
const app = express()
const router = require('./app/router/')
const port = require('./config/config')
const scheduler = require('./app/services/cron')

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  meta: false,
  msg: 'HTTP  ',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false }
}))

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', router)

scheduler.schedule()

app.listen(port.PORT, () => {
  console.log(`Node server listening on port ${port.PORT}`)
})
