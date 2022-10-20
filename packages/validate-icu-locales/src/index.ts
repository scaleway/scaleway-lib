import { parse } from '@formatjs/icu-messageformat-parser'
import { info } from 'console'
import fs from 'fs'
import { globby } from 'globby'
import { importFromStringSync } from 'module-from-string'

const args = process.argv.slice(2)
const pattern = args[0]

const { error, table } = console

type Err = {
  err: unknown
  value: string
  key: string
  filePath: string
}
const errors: Err[] = []

const findICUError = (locales: { [key: string]: string }, filePath: string) => {
  Object.keys(locales).forEach(key => {
    const value = locales[key]

    try {
      parse(value)
    } catch (err) {
      errors.push({
        err,
        value,
        key,
        filePath,
      })
    }
  })
}

const readFiles = (files: string[]) =>
  files.forEach(file => {
    const extension = file.split('.').pop()

    if (extension === 'json') {
      const json = fs.readFileSync(file).toString()
      try {
        const locales = JSON.parse(json) as Record<string, string>

        findICUError(locales, file)
      } catch (err) {
        error(err)
      }
    }

    if (extension === 'ts' || extension === 'js') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const d: { default: Record<string, string> } = importFromStringSync(
        fs.readFileSync(file).toString(),
        { transformOptions: { loader: 'ts' } },
      )

      if (typeof d.default === 'object') {
        findICUError(d.default, file)
      } else {
        error('export default from: ', file, ' is not an object')
      }
    }
  })

const files = await globby(pattern)

if (files.length > 0) {
  table(files)
  readFiles(files)
}

if (files.length === 0) {
  info('There is no files matching this pattern', pattern)
}

if (errors.length > 1) {
  error({ errors })
  info(new Error('There is somes ICU error'))
  process.exit(1)
}
