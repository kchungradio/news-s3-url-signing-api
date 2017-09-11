const slugify = require('slugify')

module.exports = str => {
  let slug = slugify(str, {
    lower: true,
    remove: /'/g
  })
  // TODO: check slug and increment if taken
  // self-referential function
  return slug
}
