#!/usr/bin/env node

import * as fs from 'fs/promises'
import { parse } from '@formatjs/icu-messageformat-parser'
import type { ParserError } from '@formatjs/icu-messageformat-parser/error'
import { globby } from 'globby'
import { importFromString } from 'module-from-string'

const args = process.argv.slice(2)
const pattern = args[0]

type Locales = Record<string, string>
type ErrorICU = {
  message: ParserError['message']
  value: string
  key: string
  filePath: string
}

type ErrorsICU = (ErrorICU | undefined)[]

const isObject = (obj: unknown): obj is Record<string, unknown> =>
  obj === Object(obj)

const findICUErrors = (
  locales: { [key: string]: string },
  filePath: string,
): ErrorsICU => {
  const errors = Object.entries(locales)
    .map(([key, value]) => {
      try {
        parse(value)

        return undefined
      } catch (err) {
        const { message } = err as ParserError

        return {
          message,
          value,
          key,
          filePath,
        }
      }
    })
    .filter(Boolean)

  return errors
}

const readFiles = async (files: string[]): Promise<ErrorsICU> => {
  const errors = []

  // eslint-disable-next-line @typescript-eslint/await-thenable
  for await (const file of files) {
    const extension = file.split('.').pop()

    if (extension === 'json') {
      try {
        const data = await fs.readFile(file)
        const jsonFile = data.toString()

        const locales = JSON.parse(jsonFile) as Locales

        const ICUErrors = findICUErrors(locales, file)
        errors.push(...ICUErrors)
      } catch (err) {
        console.error({ file, err })
      }
    }

    if (extension === 'ts' || extension === 'js') {
      try {
        const data = await fs.readFile(file)
        const javascriptFile = data.toString()

        const mod: unknown = await importFromString(javascriptFile, {
          transformOptions: { loader: 'ts' },
        })

        if (isObject(mod)) {
          if ('default' in mod) {
            const { default: locales } = mod as { default: Locales }

            const ICUErrors = findICUErrors(locales, file)
            errors.push(...ICUErrors)
          } else {
            console.error('export default from: ', file, ' is not an object')
          }
        } else {
          console.error(file, ' is not an object')
        }
      } catch (err) {
        console.error({ err, file })
      }
    }
  }

  return errors
}

if (!pattern) {
  console.error('Missing pattern: validate-icu-locales [PATTERN]')
  process.exit(1)
}

const files = await globby(pattern)

if (files.length === 0) {
  console.error('There is no files matching this pattern', pattern)
  process.exit(1)
}

console.table(files)

const errors = await readFiles(files)

if (errors.length > 0) {
  console.error({
    errors,
  })
  process.exit(1)
}
