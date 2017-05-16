const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-west-2'
})

const docClient = new AWS.DynamoDB.DocumentClient()

const params = {
  TableName: 'kchung-news-stories'
}

const getStoriesList = () => {
  return new Promise((resolve, reject) => {
    docClient.scan({
      TableName: 'kchung-news-stories',
      AttributesToGet: ['date', 'contributor', 'title', 'url']
    }, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
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

module.exports = { getStoriesList, getStories, createStory }
