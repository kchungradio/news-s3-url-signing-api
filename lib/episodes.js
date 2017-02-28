const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-west-2'
})

const docClient = new AWS.DynamoDB.DocumentClient()

const params = {
  TableName: 'kchung-news'
}

module.exports = {
  getEpisodes () {
    return new Promise(function (resolve, reject) {
      docClient.scan(params, function (err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}
