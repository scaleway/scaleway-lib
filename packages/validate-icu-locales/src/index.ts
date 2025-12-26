#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import type { ParseArgsConfig } from 'node:util'
import { parseArgs } from 'node:util'
import type { Location } from '@formatjs/icu-messageformat-parser'
import { parse } from '@formatjs/icu-messageformat-parser'
import { globby } from 'globby'
import { importFromString } from 'module-from-string'

type ParserError = {
  // it's a enum inside @formatjs, don't use it today
  kind: string
  message: string
  location: Location
}
// export interface ParserError {
//   kind: ErrorKind;
//   message: string;
//   location: Location;
// }

const options: ParseArgsConfig['options'] = {
  ignoreTag: {
    default: false,
    short: 'i',
    type: 'boolean',
  },
}

const { values, positionals } = parseArgs({ allowPositionals: true, options })

const pattern = positionals[0]

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
        parse(value, {
          // Need to cast as node doesn't allow generic to parseArgs
          ignoreTag: values['ignoreTag'] as boolean,
        })

        return undefined
      } catch (err) {
        const { message } = err as ParserError

        return {
          filePath,
          key,
          message,
          value,
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
        const data = await readFile(file)
        const jsonFile = data.toString()

        const locales = JSON.parse(jsonFile) as Locales

        const ICUErrors = findICUErrors(locales, file)
        errors.push(...ICUErrors)
      } catch (err) {
        console.error({ err, file })
      }
    }

    if (extension === 'ts' || extension === 'js') {
      try {
        const data = await readFile(file)
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
