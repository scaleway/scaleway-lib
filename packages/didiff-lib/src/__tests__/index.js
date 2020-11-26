/* eslint-disable no-console */

import fs from 'fs'
import nodePath from 'path'
import capturesPages from '../capture'
import isCapturesDifferent from '../diff'
import {
  getPathnameFromUrl,
  getImageInformations,
  getImageData,
  getFile,
  removeFiles,
} from '../helpers'
import log from '../log'
import s3 from '../s3'
import urls from '../urls'

jest.unmock('lookpath')

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

// Comment these two lines if you want to have logs during the tests
jest.spyOn(console, 'info').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('didiff-lib', () => {
  describe('log', () => {
    it('should call console.info one time', () => {
      log.info('hello')
      expect(console.info.mock.calls.length).toBe(1)
    })
    it('should call console.error one time', () => {
      log.err('hello')
      expect(console.error.mock.calls.length).toBe(1)
    })
  })

  describe('urls', () => {
    it('should return one pair of urls', () => {
      const res = urls(`${__dirname}/simple-urls.txt`)
      expect(res.length).toBe(1)
    })
    it('should return three pair of urls', () => {
      const res = urls(`${__dirname}/multiple-urls.txt`)
      expect(res.length).toBe(3)
    })
    it('should throw an error if no file', () => {
      urls()
      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })

  describe('s3', () => {
    it('should create s3 client', () => {
      s3.init()
    })
    it('should get s3 client with default config', () => {
      s3.init()
      const client = s3.getClient()
      expect(client.config.endpoint).toMatch('s3.fr-par.amazonaws.com')
    })
    it('should get s3 client with ENV config', () => {
      const endpoint = 's3.fr-par.scw.cloud'
      process.env = Object.assign(process.env, {
        REACT_APP_DIDIFF_S3_ENDPOINT: endpoint,
      })
      s3.init()
      const client = s3.getClient()
      expect(client.config.endpoint).toMatch(endpoint)
    })
    it('should upload 3 files', async () => {
      s3.init()
      const client = s3.getClient()
      client.upload = jest.fn(() => {})
      s3.setClient(client)

      const files = ['file1', 'file2', 'file3']
      await s3.uploadBatch(files)
      expect(client.upload.mock.calls.length).toBe(3)
    })
  })

  describe('diff', () => {
    it('should not detect a diff', async () => {
      const fsPathTestImage = nodePath.resolve(__dirname, './test.png')
      const hasDetectedDiff = await isCapturesDifferent({
        original: { fullPath: fsPathTestImage },
        sample: { fullPath: fsPathTestImage },
        diff: { fullPath: '' },
      })

      expect(hasDetectedDiff).toBe(false)
    })
    it('should detect a diff', async () => {
      const fsPathTestImage = nodePath.resolve(__dirname, './test.png')
      const fsPathTest2Image = nodePath.resolve(__dirname, './test2.png')
      const fsPathFinalImage = nodePath.resolve(__dirname, './final.png')

      const hasDetectedDiff = await isCapturesDifferent({
        original: { fullPath: fsPathTestImage },
        sample: { fullPath: fsPathTest2Image },
        diff: { fullPath: fsPathFinalImage },
      })
      const file = getFile(fsPathTestImage)

      expect(hasDetectedDiff).toBe(true)
      expect(file).toBeDefined()

      removeFiles([fsPathFinalImage])
    })
  })

  describe('helpers', () => {
    describe('getPathnameFromUrl', () => {
      it('should get slug from basic url', () => {
        expect(getPathnameFromUrl('https://scaleway.com/en/saas')).toMatch(
          'en-saas',
        )
      })
      it('should get slug from complex url', () => {
        expect(
          getPathnameFromUrl('https://scaleway.com/fr/dedibox/start'),
        ).toMatch('fr-dedibox-start')
      })
      it('should get slug from home url', () => {
        expect(getPathnameFromUrl('https://scaleway.com/en/')).toMatch(
          'en-index',
        )
      })
    })
    describe('getImageInformations', () => {
      it('should get informations about image', () => {
        const infos = getImageInformations({
          url: 'https://scaleway.com/en/saas',
          pathname: 'en-saas',
          name: 'original',
        })
        const fsPath = nodePath.resolve(__dirname, '../screenshots')

        expect(infos).toMatchObject({
          url: 'https://scaleway.com/en/saas',
          name: 'original',
          fullName: 'en-saas-original.png',
          fullPath: `${fsPath}/en-saas-original.png`,
          path: `${fsPath}/en-saas`,
        })
      })
    })
    describe('getFile', () => {
      it('should get file data from fs', () => {
        const fsPathTestImage = nodePath.resolve(__dirname, './test.png')
        const file = getFile(fsPathTestImage)

        expect(file).toBeDefined()
      })
    })
    describe('getImageData', () => {
      it('should get PNG from fs', () => {
        const fsPathTestImage = nodePath.resolve(__dirname, './test.png')
        const png = getImageData(fsPathTestImage)

        expect(png.image).toBeDefined()
        expect(png.png).toBeDefined()
      })
    })
    describe('removeFiles', () => {
      it('should remove 3 files', () => {
        fs.unlinkSync = jest.fn(() => {})

        const fsPathTestImage = nodePath.resolve(__dirname, './test.png')

        removeFiles([fsPathTestImage, fsPathTestImage, fsPathTestImage])
        expect(fs.unlinkSync.mock.calls.length).toBe(3)
        fs.unlinkSync.mockClear()
      })
    })
  })

  describe.skip('capture', () => {
    it('should capture two pages', async () => {
      jest.setTimeout(50000)
      jest.retryTimes(3)

      const fsCapturesPath = `${nodePath.resolve(__dirname, './screenshots')}`

      if (!fs.existsSync(fsCapturesPath)) {
        fs.mkdirSync(fsCapturesPath)
      }

      await capturesPages({
        original: {
          url: 'https://scaleway.com/en/saas',
          name: 'original',
          fullName: 'saas-original.png',
          fullPath: `${fsCapturesPath}/saas-original.png`,
          path: `${fsCapturesPath}/saas`,
        },
        sample: {
          url: 'https://scaleway.com/en/saas',
          name: 'sample',
          fullName: 'saas-sample.png',
          fullPath: `${fsCapturesPath}/saas-sample.png`,
          path: `${fsCapturesPath}/saas`,
        },
      })

      const originalFile = getFile(`${fsCapturesPath}/saas-original.png`)
      const sampleFile = getFile(`${fsCapturesPath}/saas-sample.png`)

      expect(originalFile).toBeDefined()
      expect(sampleFile).toBeDefined()

      fs.rmdirSync(fsCapturesPath, { recursive: true })
    })
  })
})
