const { router, get, post } = require('microrouter')

const { getStories, postStory } = require('./lib/stories')

module.exports = router(
  get('/', getStories),
  post('/', postStory)
)
