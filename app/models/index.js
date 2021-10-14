const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const tunnel = require('tunnel-ssh')

const config = require('../../config/database.js')

const db = {}
let sequelize = null

if (process.env.NODE_ENV === 'local') {
  sequelize = new Sequelize(config)
} else {
  sequelize = new Sequelize(`mysql://${config.username}:${config.password}@${config.host}:3306/${config.database}`, {
    dialectOptions: {
      decimalNumbers: true
    }
  })

  const tunnelConfig = {
    username: config.sshUsername, // remote server username
    host: config.sshHost, // remote server ip
    port: config.sshPort, // remote server port
    dstHost: config.sshDstHost, // database server ip
    dstPort: config.sshDstPort, // database server port
    // localHost: '127.0.0.1', // local ip (will be use at env DATABASE_URL settings)
    // localPort: 3306, // local port make sure this port is not conflict with others port
    privateKey: config.sshPrivateKey, // your public key location
    keepAlive: true // option in the configuration !
  }

  const server = tunnel(tunnelConfig, function (error, server) {
    if (error) {
      console.error(error)
    } else {
      sequelize.authenticate().then(() => {
        console.log('Database connection established')
      }).catch(function (err) {
        console.error('Unable establish database connection', err)
      })
    }
  })

  server.on('error', function (err) {
    console.error('unable establish server', err)
  })
}

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
