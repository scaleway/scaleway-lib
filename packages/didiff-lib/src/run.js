import dotenv from 'dotenv'
import fs from 'fs'
import nodePath from 'path'
import capture from './capture'
import isCapturesDifferents from './diff'
import {
  getPathnameFromUrl,
  getImageInformations,
  getFile,
  removeFiles,
} from './helpers'
import log from './log'
import s3 from './s3'
import getUrls from './urls'

dotenv.config()

const TEST_DATE = new Date()

function cleanCaptures(fsPaths = []) {
  log.info('Cleaning screenshots ...')
  removeFiles(fsPaths)
  log.info('Cleaning screenshots ✅')
}
function upload(pathname, { original, sample, diff }) {
  const dateString = TEST_DATE.toLocaleDateString('fr').replace(/\//g, '-')
  const timeString = TEST_DATE.toLocaleTimeString('fr').replace(/:/g, '-')
  const s3path = `${dateString}!${timeString}/${pathname}`

  s3.uploadBatch([
    {
      key: `${s3path}/${original.name}`,
      body: getFile(original.fullPath),
    },
    {
      key: `${s3path}/${sample.name}`,
      body: getFile(sample.fullPath),
    },
    {
      key: `${s3path}/${diff.name}`,
      body: getFile(diff.fullPath),
    },
  ])
}
function groupImagesInformations(pathname, { original, sample }) {
  return {
    originalInfos: getImageInformations({
      url: original,
      pathname,
      name: 'original',
    }),
    sampleInfos: getImageInformations({
      url: sample,
      pathname,
      name: 'sample',
    }),
    diffInfos: getImageInformations({
      pathname,
      name: 'diff',
    }),
  }
}

async function startLoop(urls) {
  const nbUrls = urls.length
  let totalDiff = 0

  log.info(`Didiff will now check ${nbUrls} urls 📸`)
  for (let i = 0; i < nbUrls; i += 1) {
    const [original, sample] = urls[i]
    const pathname = getPathnameFromUrl(original)

    const { originalInfos, sampleInfos, diffInfos } = groupImagesInformations(
      pathname,
      {
        original,
        sample,
      },
    )

    // eslint-disable-next-line no-await-in-loop
    await capture({
      original: originalInfos,
      sample: sampleInfos,
    })

    // eslint-disable-next-line no-await-in-loop
    const isDifferent = await isCapturesDifferents({
      original: originalInfos,
      sample: sampleInfos,
      diff: diffInfos,
    })

    const imagesPaths = [originalInfos.fullPath, sampleInfos.fullPath]
    if (isDifferent) {
      totalDiff += 1
      imagesPaths.push(diffInfos.fullPath)

      upload(pathname, {
        original: originalInfos,
        sample: sampleInfos,
        diff: diffInfos,
      })
    }
    cleanCaptures(imagesPaths)

    log.info(`Process for /${pathname} done.`)
    if (nbUrls - (i + 1) === 0) {
      log.info(`All urls have been handled! (${nbUrls}) 📸`)
      log.info(`Didiff found ${totalDiff} diffs.`)
      log.info(`Shutting down...`)
    } else {
      log.info(`Still ${nbUrls - (i + 1)} check to do.`)
    }
  }
}

function handleCapturesPath() {
  const capturesPath = `${nodePath.resolve(__dirname, './screenshots/')}`
  if (!fs.existsSync(capturesPath)) {
    fs.mkdirSync(capturesPath)
  }
}
function run() {
  s3.init()
  const urls = getUrls(process.argv[process.argv.length - 1])
  startLoop(urls)
}

export default () => {
  handleCapturesPath()
  run()
}
