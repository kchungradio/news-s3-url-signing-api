const url = require('url')
const { createError } = require('micro')

const { stories } = require('./lib/db')

module.exports = async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }

  switch (req.method) {
    case 'GET':
      // parse url for query params
      const { authorSlug } = url.parse(req.url, true).query
      // query or scan the db depending on query params
      const result = authorSlug
        ? await stories.query('authorSlug', '=', authorSlug)
        : await stories.scan()
      return result.Items
    // case 'POST':
    //   // validate jwt here
    //   const data = await json(req)
    //   const story = data.story
    //   const result = await createStory(story)
    //   return result
    default:
      throw createError(405, 'Invalid method')
  }
}
