const { axios } = require('axios')
const config = require('../config')

const ACCESS_TOKEN = 'accessToken'
const AUTH_URL = `${config.auth_host}/api`

const $api = axios.create({
  withCredentials: true,
  baseURL: AUTH_URL,
})

$api.interceptors.request.use((config) => {
  console.log('server main, http-token', localStorage.getItem(ACCESS_TOKEN))
  config.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
  return config
})

module.exports = { $api, ACCESS_TOKEN, AUTH_URL }
