const DynamoDB = require('dynamo-node')('us-west-2')

const stories = DynamoDB.select('kchung-news-stories-2')
const users = DynamoDB.select('kchung-news-users')

module.exports = { stories, users }
