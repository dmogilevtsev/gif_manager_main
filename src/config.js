require('dotenv').config()

module.exports = {
  port: process.env.API_PORT_MAIN || 3002,
  host: process.env.API_HOST_MAIN || 'http://localhost:',
  auth_host: process.env.API_PORT_NODE_AUTH || 3001,
  client_url: process.env.CLIENT_URL || 'http://localhost:3000',
  db: {
    database: process.env.DB_DATABASENAME_MAIN || 'gif_manager_main',
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'root',
    options: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: process.env.DB_TYPE || 'postgres',
      protocol: process.env.DB_TYPE || 'postgres',
      log: true,
    },
  },
}
