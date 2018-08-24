const jwt = require('jsonwebtoken')
const { createError } = require('micro')

const { JWS_SECRET } = require('../config')

module.exports = handler => (req, res) => {
  const [bearer, token] = req.headers.authorization.split(' ')

  if (bearer !== 'Bearer') {
    throw createError(401, 'Must use Bearer')
  }

  try {
    jwt.verify(token, JWS_SECRET)
  } catch (err) {
    throw createError(401, 'Unauthorized')
  }

  return handler(req, res)
}
