const { Sequelize } = require('sequelize')
const config = require('./config')

module.exports = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db.options
)
