import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'
import { createPNG, getImageData } from './helpers'
import log from './log'

const diffingOptions = {
  includeAA: true,
  threshold: 0.7,
}

function crop(image, path, options) {
  return sharp(image).extract(options).toFile(path)
}
async function cropBiggerImage({ image, path }, dimensions) {
  log.info('Cropping...')
  await crop(image, path, {
    left: 0,
    top: 0,
    width: dimensions.width,
    height: dimensions.height,
  })
}
function getSmallestDimensions({ originalData, sampleData }) {
  if (sampleData.png.height > originalData.png.height) {
    return {
      source: 'original',
      width: originalData.png.width,
      height: originalData.png.height,
    }
  }
  if (sampleData.png.height < originalData.png.height) {
    return {
      source: 'sample',
      width: sampleData.png.width,
      height: sampleData.png.height,
    }
  }
  return undefined
}

async function isCapturesDifferents({ original = {}, sample = {}, diff = {} }) {
  log.info('Diffing...')
  let originalData = getImageData(original.fullPath)
  let sampleData = getImageData(sample.fullPath)

  const smallestDimensions =
    getSmallestDimensions({
      originalData,
      sampleData,
    }) || {}

  if (smallestDimensions.source) {
    const { source, ...dimensions } = smallestDimensions
    const data =
      source === 'original'
        ? { image: sampleData.image, path: sample.fullPath }
        : { image: originalData.image, path: original.fullPath }
    await cropBiggerImage(data, dimensions)
    if (source === 'original') {
      sampleData = getImageData(sample.fullPath)
    } else {
      originalData = getImageData(original.fullPath)
    }
  }

  const diffPNG = new PNG({
    width: smallestDimensions.width || originalData.png.width,
    height: smallestDimensions.height || originalData.png.height,
  })

  try {
    const nbUnmatchedPx = pixelmatch(
      originalData.png.data,
      sampleData.png.data,
      diffPNG.data,
      diffPNG.width,
      diffPNG.height,
      diffingOptions,
    )
    if (nbUnmatchedPx > 0) {
      createPNG(diff.fullPath, diffPNG)
      log.info('Diff was found ❗️')
      return true
    }
    log.info('No diff, skipping')
    return false
  } catch (error) {
    log.err('Fail during the diffing process ❌', error)
    process.exit(1)
  }
  return undefined
}

export default isCapturesDifferents
