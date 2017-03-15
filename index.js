const { json, createError } = require('micro')

const { getStories, createStory } = require('./lib/stories')

module.exports = async function (req, res) {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }

  switch (req.method) {
    case 'GET':
      const stories = await getStories()
      return stories.Items
    case 'POST':
      // validate jwt here
      const data = await json(req)
      const story = data.story
      const result = await createStory(story)
      return result
    default:
      throw createError(405, 'Invalid method')
  }
}
