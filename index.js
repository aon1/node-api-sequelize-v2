const express = require('express')
const winston = require('winston')
const expressWinston = require('express-winston')
const app = express()
const router = require('./app/router/')
const port = require('./config/config')
const scheduler = require('./app/services/cron')
const { format } = require('winston')

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamp: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        myFormat,
        winston.format.json()
      )
    })
  ],
  meta: false,
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
