const { send } = require('micro')

const allowAllOriginsOutsideProduction = res => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
}

const allowAuthorizationHeader = res => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Headers', 'Authorization')
  }
}

const allowMethods = res => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader(
      'Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE'
    )
  }
}

const preflight = (req, res) => {
  allowAllOriginsOutsideProduction(res)
  allowAuthorizationHeader(res)
  allowMethods(res)
  send(res, 200)
}

module.exports = { allowAllOriginsOutsideProduction, preflight }
