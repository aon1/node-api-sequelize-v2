const config = require('./config')

module.exports = {
  username: config.MYSQL_USERNAME,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  dialect: 'mysql',
  logging: config.SEQUELIZE_LOGGING,
  dialectOptions: { decimalNumbers: true },
  sshUsername: config.SSH_USERNAME,
  sshHost: config.SSH_HOST,
  sshPort: config.SSH_PORT,
  sshDstHost: config.SSH_DST_HOST,
  sshDstPort: config.SSH_DST_PORT,
  sshPrivateKey: config.SSH_PRIVATE_KEY
}
