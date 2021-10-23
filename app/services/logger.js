const winston = require('winston')
const { format } = require('winston')

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const logger = winston.createLogger({
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
  level: 'info',
  defaultMeta: { service: 'twitch-youtube-stats' }
})

module.exports = { logger }
