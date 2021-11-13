const axios = require('axios')
const config = require('../config')
const ApiError = require('../error/ApiError')

const MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days

module.exports = async (req, res, next) => {
  try {
    const authHeaer = req.headers.authorization
    if (!authHeaer) {
      return next(ApiError.unauthorized())
    }
    const accessToken = authHeaer.split(/\s/)[1]
    if (!accessToken) {
      return next(ApiError.unauthorized())
    }
    const refreshToken = req.headers.cookie.split(/\=/)[1]
    const userData = await checkUserData({ accessToken, refreshToken })
    if (!userData) {
      return next(ApiError.unauthorized())
    }
    req.user = userData.data.user
    req.headers.authorization = `Bearer ${userData.data.accessToken}`
    req.headers.refreshToken = userData.data.refreshToken
    res.cookie('refreshToken', userData.data.refreshToken, {
      maxAge: MAX_AGE,
      httpOnly: true,
    })
    next()
  } catch (error) {
    return next(ApiError.unauthorized())
  }
}

async function checkUserData({ accessToken, refreshToken }) {
  return await axios.get(`http://${config.auth_host}:${config.auth_port}/api/refresh`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      refreshToken
    },
  })
}
