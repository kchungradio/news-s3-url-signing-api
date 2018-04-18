const url = require('url')
const { send, json, createError } = require('micro')
const slugify = require('./slugify')

const { stories } = require('./db')

const getStories = async (req, res) => {
  // parse url for query params
  const { authorSlug } = url.parse(req.url, true).query
  // query or scan the db depending on query params
  let result
  try {
    result = authorSlug
      ? await stories
        .useIndex('authorSlug-index')
        .query('authorSlug', '=', authorSlug)
      : await stories.scan()
  } catch (err) {
    console.error(err)
  }

  return result.Items
}

const getStory = async (req, res) => {
  let result
  try {
    result = await stories
      .useIndex('titleSlug-index')
      .query('titleSlug', '=', req.params.titleSlug)
  } catch (err) {
    console.error(err)
  }

  return result.Items[0]
}

const createStory = async (req, res) => {
  authenticate(req)

  let story = await json(req)

  validateStory(story)
  story.titleSlug = slugify(story.title)
  story.createdAt = new Date().toISOString()

  let result
  try {
    result = await stories.add(story)
    // console.log('result', result)
  } catch (err) {
    console.error(err)
  }
  return result
}

const replaceStory = async (req, res) => {
  authenticate(req)

  let story = await json(req)
  if (req.params.titleSlug !== story.titleSlug) {
    throw createError(400, 'titleSlug in url doesn\'t match titleSlug in body')
  }

  validateStory(story)
  story.titleSlug = slugify(story.title)
  story.updatedAt = new Date().toISOString()

  const { authorId, createdAt } = story
  delete story.authorId
  delete story.createdAt

  let result
  try {
    result = await stories.update({ authorId, createdAt }, story)
  } catch (err) {
    console.error(err)
  }
  return result
}

const changeAuthorName = async (req, res) => {
  authenticate(req)

  let { newName, session } = await json(req)

  // make sure they're only updating their own stories
  if (session.slug !== req.params.slug) {
    throw createError(400, 'Slug in url doesn\'t match slug in session')
  }

  // get all stories with the matching authorId
  const result = await stories.query('authorId', '=', session.id)
  const storiesToUpdate = result.Items
  // console.log('storiesToUpdate', storiesToUpdate)

  // change all matching stories
  for (let story of storiesToUpdate) {
    stories.update({
      authorId: story.authorId,
      createdAt: story.createdAt
    }, {
      author: newName,
      authorSlug: slugify(newName)
    }).catch(err => {
      console.error(err)
    })
  }

  // 202 because of above asynchronous updates
  // https://httpstatuses.com/202
  send(res, 202, `Stories' author names updated`)
}

const authenticate = req => {
  // TODO: authenticate
  // TODO: match authenticating user to author name and slug
}

const validateStory = story => {
  if (!story.authorId || !story.authorSlug || !story.author) {
    throw createError(400, 'Missing author info')
  }
  if (!story.title || !story.audio) {
    throw createError(400, 'Missing title or audio')
  }
}

module.exports = {
  getStories,
  getStory,
  createStory,
  replaceStory,
  changeAuthorName
}
