import S3 from 'aws-sdk/clients/s3'
import log from './log'

let s3Client = null
function setClient(client) {
  s3Client = client
}
function getClient() {
  return s3Client
}

function init() {
  const client = new S3({
    endpoint: process.env.REACT_APP_DIDIFF_S3_ENDPOINT,
    secretAccessKey: process.env.REACT_APP_DIDIFF_S3_SECRET_KEY,
    accessKeyId: process.env.REACT_APP_DIDIFF_S3_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'fr-par',
  })
  setClient(client)
}

function upload({ key, body }) {
  log.info('Uploading', key)
  const client = getClient()
  client.upload(
    {
      Key: key,
      Body: body,
      Bucket: process.env.REACT_APP_DIDIFF_S3_BUCKET_NAME,
    },
    error => {
      if (error) {
        log.err('Error uploading ⚠️', { error })
      }
    },
  )
}

async function uploadBatch(batch = []) {
  batch.forEach(data => upload(data))
}

export default {
  init,
  uploadBatch,
  setClient,
  getClient,
}
