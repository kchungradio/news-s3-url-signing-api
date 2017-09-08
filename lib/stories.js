const url = require('url')
const { json, createError } = require('micro')
const slugify = require('slugify')

const { allowAllOriginsOutsideProduction } = require('./cors')
const { stories } = require('./db')

const getStories = async (req, res) => {
  allowAllOriginsOutsideProduction(res)

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
  allowAllOriginsOutsideProduction(res)

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
  allowAllOriginsOutsideProduction(res)
  authenticate(req)

  let story = await json(req)

  validateStory(story)
  story.titleSlug = slugifyTitle(story.title)
  story.createdAt = new Date().toISOString()

  let result
  try {
    result = await stories.add(story)
  } catch (err) {
    console.error(err)
  }
  return result
}

const replaceStory = async (req, res) => {
  allowAllOriginsOutsideProduction(res)
  authenticate(req)

  let story = await json(req)
  if (req.params.titleSlug !== story.titleSlug) {
    createError(400, 'titleSlug in url doesn\'t match titleSlug in body')
  }

  validateStory(story)
  story.titleSlug = slugifyTitle(story.title)

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

const slugifyTitle = title => {
  let titleSlug = slugify(title, {
    lower: true,
    remove: /'/g
  })
  // TODO: check slug and increment if taken
  // self-referential function
  return titleSlug
}

module.exports = {
  getStories,
  getStory,
  createStory,
  replaceStory
}
