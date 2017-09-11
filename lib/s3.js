const aws = require('aws-sdk')
const uuidv4 = require('uuid/v4')
const { createError } = require('micro')

const options = {
  bucket: 'archive.kchung.news',
  region: 'us-west-2',
  signatureVersion: 'v4',
  ACL: 'public-read'
}

const s3 = new aws.S3(options)

const getSignedUrl = (req, res) => {
  // TODO: check token
  console.log(req.headers.authorization)

  const originalFilename = req.query.objectName
  const fileExtension = originalFilename.split('.').pop()
  const filename = `${uuidv4()}.${fileExtension}`

  const params = {
    Bucket: options.bucket,
    Key: filename,
    Expires: 60,
    ContentType: req.query.contentType,
    ACL: options.ACL
  }

  const signedUrl = s3.getSignedUrl('putObject', params)

  if (signedUrl) {
    return {
      signedUrl,
      filename,
      originalFilename,
      publicUrl: signedUrl.split('?').shift()
    }
  } else {
    throw createError(500, 'Cannot create S3 signed URL')
  }
}

module.exports = { getSignedUrl }
