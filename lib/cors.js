const { send } = require('micro')

const allowAllOriginsOutsideProduction = (res) => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
}

const allowAuthorizationHeader = (res) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization')
}

const preflight = (req, res) => {
  allowAllOriginsOutsideProduction(res)
  allowAuthorizationHeader(res)
  send(res, 200)
}

module.exports = { allowAllOriginsOutsideProduction, preflight }
