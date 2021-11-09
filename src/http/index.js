import config from '../config'

const { axios } = require('axios')

export const ACCESS_TOKEN = 'accessToken'

export const AUTH_URL = `${config.auth_host}/api`

const $api = axios.create({
  withCredentials: true,
  baseURL: AUTH_URL,
})

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
  return config
})

module.exports = $api
