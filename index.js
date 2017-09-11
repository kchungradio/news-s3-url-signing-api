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

// TODO: authenticate in lib/stories
// TODO: authenticate in lib/s3
// TODO: paginate

// primary key: authorId
// sort key: createdAt

module.exports = cors(router(
  get('/', getStories), // allows ?authorSlug=author-slug
  get('/:titleSlug', getStory),

  post('/', createStory),
  put('/:titleSlug', replaceStory),

  get('/s3/sign', getSignedUrl),

  put('/author/:slug', changeAuthorName)
))
