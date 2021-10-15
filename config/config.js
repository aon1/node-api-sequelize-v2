const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
})

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  MYSQL_USERNAME: process.env.MYSQL_USERNAME,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  TWITCH_ACCESS_TOKEN: process.env.TWITCH_ACCESS_TOKEN,
  SSH_USERNAME: process.env.SSH_USERNAME,
  SSH_HOST: process.env.SSH_HOST,
  SSH_PORT: process.env.SSH_PORT,
  SSH_DST_HOST: process.env.SSH_DST_HOST,
  SSH_DST_PORT: process.env.SSH_DST_PORT,
  SSH_PRIVATE_KEY: process.env.SSH_PRIVATE_KEY,
  CRON_EXPRESSION_UPDATE_STREAMS: process.env.CRON_EXPRESSION_UPDATE_STREAMS,
  CRON_EXPRESSION_CHECK_STREAM_IS_FINISHED: process.env.CRON_EXPRESSION_CHECK_STREAM_IS_FINISHED,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY
}
