const { getEpisodes } = require('./lib/episodes')

module.exports = async function (req, res) {
  try {
    const episodes = await getEpisodes()
    return episodes.Items
  } catch (err) {
    console.error(err)
  }
}
