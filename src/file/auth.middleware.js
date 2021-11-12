const axios = require('axios')
const config = require('../config')
const ApiError = require('../error/ApiError')

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
    const userData = await checkUserData(accessToken)
    if (!userData) {
      return next(ApiError.unauthorized())
    }
    req.user = userData.data.user
    next()
  } catch (error) {
    return next(ApiError.unauthorized())
  }
}

async function checkUserData(accessToken) {
  return await axios.get(`${config.auth_host}:${config.auth_port}/api/refresh`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
