const { router, get, post, options } = require('microrouter')

const { getStories, postStory } = require('./lib/stories')
const { getSignedUrl } = require('./lib/s3')
const { preflight } = require('./lib/cors')

module.exports = router(
  get('/', getStories),
  post('/', postStory),
  get('/s3/sign', getSignedUrl),
  options('/s3/sign', preflight)
)
