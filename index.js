require('now-env')

const {
  router,
  get,
  post,
  put
} = require('microrouter')
const cors = require('micro-cors')()

const {
  getStories,
  getStory,
  createStory,
  replaceStory,
  changeAuthorName
} = require('./lib/stories')
const { getSignedUrl } = require('./lib/s3')
const authorize = require('./lib/authorize')

// TODO: authenticate in lib/stories
// TODO: paginate

// primary key: authorId
// sort key: createdAt

module.exports = cors(router(
  get('/', getStories), // allows ?authorSlug=author-slug
  get('/:titleSlug', getStory),

  post('/', createStory),
  put('/:titleSlug', replaceStory),

  get('/s3/sign', authorize(getSignedUrl)),

  put('/author/:slug', changeAuthorName)
))
