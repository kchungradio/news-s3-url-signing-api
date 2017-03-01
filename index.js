const { getStories } = require('./lib/stories')

const fetchStories = async () => {
  try {
    const stories = await getStories()
    return stories.Items
  } catch (err) {
    console.error(err)
  }
}

module.exports = async function (req, res) {
  return fetchStories()
}
