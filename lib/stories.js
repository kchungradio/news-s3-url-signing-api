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
  const result = authorSlug
    ? await stories.query('authorSlug', '=', authorSlug)
    : await stories.scan()
  return result.Items
}

const postStory = async (req, res) => {
  allowAllOriginsOutsideProduction(res)

  // TODO: authenticate
  // TODO: match authenticating user to author name and slug

  const story = await json(req)

  // validate story
  if (!story.title || !story.audio) {
    throw createError(400, 'Missing title or audio')
  }

  story.titleSlug = slugify(story.title, {
    lower: true,
    remove: /'/g
  })
  story.createdAt = new Date().toISOString()

  const result = await stories.add(story)
  return result
}

module.exports = { getStories, postStory }
