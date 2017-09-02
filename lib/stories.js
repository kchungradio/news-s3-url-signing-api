const url = require('url')
const { json } = require('micro')
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
  const story = await json(req)
  // TODO: validate story
  // TODO: make sure the owner matches the session creds
  story.titleSlug = slugify(story.title, {
    lower: true,
    remove: /'/g
  })
  story.createdAt = new Date().toISOString()
  const result = await stories.add(story)
  return result
}

module.exports = { getStories, postStory }
