require('dotenv').config()

module.exports = {
  port: process.env.API_PORT_MAIN,
  host: process.env.API_HOST_MAIN,
  auth_host: process.env.AUTH_HOST_MAIN,
  auth_port: process.env.API_PORT_NODE_AUTH,
  client_url: process.env.CLIENT_URL,
  db: {
    database: process.env.DB_DATABASENAME_MAIN,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dialect: process.env.DB_TYPE,
      protocol: process.env.DB_TYPE,
      log: true,
    },
  },
}
