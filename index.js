const {
  router,
  get,
  post,
  put,
  options
} = require('microrouter')
const cors = require('micro-cors')()

const {
  getStories,
  getStory,
  createStory,
  replaceStory
} = require('./lib/stories')
const { getSignedUrl } = require('./lib/s3')

// TODO: authenticate in lib/stories
// TODO: authenticate in lib/s3
// TODO: paginate
//
// primary key: authorSlug
// sort key: createdAt
// consider changing primary key to authorId in case of name change

module.exports = cors(router(
  get('/', getStories), // allows ?authorSlug=author-slug
  get('/:titleSlug', getStory),

  post('/', createStory),
  put('/:titleSlug', replaceStory),

  get('/s3/sign', getSignedUrl),

))
