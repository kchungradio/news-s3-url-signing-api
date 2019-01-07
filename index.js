require('now-env')

const { router, get } = require('microrouter')
const cors = require('micro-cors')()

const { getSignedUrl } = require('./lib/s3')
const authorize = require('./lib/authorize')

module.exports = cors(router(
  get('/', () => 'Hi'),
  get('/s3/sign', authorize(getSignedUrl))
))
