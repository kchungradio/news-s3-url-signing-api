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
  // XXX XXX XXX check token XXX XXX XXX //
  console.log(req.headers.authorization)

  const fileExtension = req.query.objectName.split('.').pop()
  const filename = `${uuidv4()}.${fileExtension}`

  const params = {
    Bucket: options.bucket,
    Key: filename,
    Expires: 60,
    ContentType: req.query.contentType,
    ACL: options.ACL
  }

  const url = s3.getSignedUrl('putObject', params)

  if (url) {
    return {
      signedUrl: url,
      publicUrl: url.split('?').shift(),
      filename: filename
    }
  } else {
    throw createError(500, 'Cannot create S3 signed URL')
  }
}

module.exports = { getSignedUrl }
