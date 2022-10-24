#!/usr/bin/env node

import { parse } from '@formatjs/icu-messageformat-parser'
import { info } from 'console'
import { readFile } from 'fs/promises'
import { globby } from 'globby'
import { importFromString } from 'module-from-string'

const args = process.argv.slice(2)
const pattern = args[0]
const { error, table } = console

let isICUError = false

const findICUError = (locales: { [key: string]: string }, filePath: string) => {
  Object.keys(locales).forEach(key => {
    const value = locales[key]

    try {
      parse(value)
    } catch (err) {
      isICUError = true
      error({
        err,
        value,
        key,
        filePath,
      })
    }
  })
}

const readFiles = async (files: string[]) => {
  for await (const file of files) {
    const extension = file.split('.').pop()

    if (extension === 'json') {
      try {
        const data = await readFile(file)
        const jsonFile = data.toString()

        const locales = JSON.parse(jsonFile) as Record<string, string>

        findICUError(locales, file)
      } catch (err) {
        error({ file, err })
      }
    }

    if (extension === 'ts' || extension === 'js') {
      try {
        const data = await readFile(file)
        const javascriptFile = data.toString()

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const d: { default: Record<string, string> } = await importFromString(
          javascriptFile,
          { transformOptions: { loader: 'ts' } },
        )

        if (typeof d.default === 'object') {
          findICUError(d.default, file)
        } else {
          error('export default from: ', file, ' is not an object')
        }
      } catch (err) {
        error({ err, file })
      }
    }
  }
}

const files = await globby(pattern)

if (files.length > 0) {
  table(files)
  await readFiles(files)
}

if (files.length === 0) {
  info('There is no files matching this pattern', pattern)
}

if (isICUError) {
  process.exit(1)
} else {
  process.exit(0)
}
