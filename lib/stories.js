const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-west-2'
})

const docClient = new AWS.DynamoDB.DocumentClient()

const params = {
  TableName: 'kchung-news-stories'
}

const getStories = () => {
  return new Promise((resolve, reject) => {
    docClient.scan(params, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const createStory = (story) => {
  params.Item = story
  return new Promise((resolve, reject) => {
    docClient.put(params, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

module.exports = { getStories, createStory }
