require('dotenv').config()

module.exports = {
  port: process.env.API_PORT,
  host: process.env.API_HOST,
  auth_host: process.env.AUTH_HOST,
  client_url: process.env.CLIENT_URL,
  db: {
    database: process.env.DB_DATABASENAME_MAIN,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: process.env.DB_TYPE || 'postgres',
      protocol: process.env.DB_TYPE || 'postgres',
      log: true,
    },
  },
}
