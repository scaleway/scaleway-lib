import { execSync } from 'child_process'
import { lookpath } from 'lookpath'
import puppeteer from 'puppeteer'
import { removeFiles } from '../helpers'
import log from '../log'
import screenshot from './screenshot'

const NB_SCREEN_PER_PAGE = 3

async function detectIfVipsExist() {
  const isVipsPresent = await lookpath('vips')

  if (isVipsPresent === 'undefined') {
    log.err('vips library seems to not be installed on your system.')
    log.err('Didiff need it to process screenshots. Please install it.')
    return false
  }
  return true
}

async function capturePages({ original, sample }) {
  log.info('Capturing...')
  const isVipsInstalled = await detectIfVipsExist()
  if (!isVipsInstalled) {
    process.exit(1)
    return
  }
  try {
    const viewportWidth =
      parseInt(process.env.REACT_APP_DIDIFF_VIEWPORT_WIDTH || '', 10) || 990

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
      ],
    })

    await Promise.all(
      [original, sample].map(async infos => {
        const page = await browser.newPage()

        await page.setViewport({
          height: 800,
          width: viewportWidth,
        })
        await page.goto(infos.url)

        const pageHeight = await page.evaluate(
          () => document.getElementsByTagName('html')[0].scrollHeight,
        )
        const partHeight = Math.round(pageHeight / NB_SCREEN_PER_PAGE)

        const filesPath = Array.from({ length: NB_SCREEN_PER_PAGE }).map(
          (_, index) => `${infos.path}-${infos.name}-${index}.png`,
        )

        await Promise.all(
          filesPath.map((path, index) =>
            screenshot(page, {
              path,
              viewportWidth,
              viewportHeight: partHeight * (index + 1),
              screeshotHeight: partHeight,
              offset: partHeight * index,
            }),
          ),
        )

        execSync(
          `vips arrayjoin "${filesPath.join(' ')}" ${
            infos.fullPath
          } --across 1`,
          { stdio: 'inherit' },
        )
        removeFiles(filesPath)
      }),
    )

    browser.close()
  } catch (error) {
    log.err('Fail during the screenshoting process ❌', error)
    process.exit(1)
  }
}

export default capturePages
