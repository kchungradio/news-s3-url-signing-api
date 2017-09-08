const DynamoDB = require('dynamo-node')('us-west-2')

// aws dynamodb default max retries is 10
// https://github.com/aws/aws-sdk-js/issues/402

const stories = DynamoDB.select('kchung-news-stories')
const users = DynamoDB.select('kchung-news-users')

module.exports = { stories, users }
