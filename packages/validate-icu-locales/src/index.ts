#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import type { Location } from '@formatjs/icu-messageformat-parser'
import { parse } from '@formatjs/icu-messageformat-parser'
import type { GlobOptions } from 'tinyglobby'
import { escapePath, glob } from 'tinyglobby'

type ParserError = {
  // it's a enum inside @formatjs, don't use it today
  kind: string
  message: string
  location: Location
}

const options = {
  ignoreTag: {
    default: false,
    short: 'i',
    type: 'boolean',
  },
} as const

const { values, positionals } = parseArgs({ allowPositionals: true, options })

const [pattern] = positionals

type Locales = Record<string, string>
type ErrorICU = {
  message: ParserError['message']
  value: string
  key: string
  filePath: string
}

type ErrorsICU = (ErrorICU | undefined)[]

const isObject = (obj: unknown): obj is Record<string, unknown> => {
  //
  const newObj = new Object(obj)

  return obj === newObj
}

const findICUErrors = (locales: Record<string, string>, filePath: string): ErrorsICU => {
  const errors = Object.entries(locales)
    .map(([key, value]) => {
      try {
        parse(value, {
          ignoreTag: values.ignoreTag,
        })

        return undefined
      } catch (error) {
        const { message } = error as ParserError

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

const handleJson = async (file: string) => {
  try {
    const data = await readFile(file)
    const jsonFile = data.toString()

    const locales = JSON.parse(jsonFile) as Locales

    const ICUErrors = findICUErrors(locales, file)
    return ICUErrors
  } catch (error) {
    console.error({ error, file })
    return []
  }
}

const handleFile = async (file: string) => {
  try {
    const data: unknown = await import(file)

    if (isObject(data)) {
      if ('default' in data) {
        const { default: locales } = data as { default: Locales }

        const ICUErrors = findICUErrors(locales, file)
        return ICUErrors
      }
      console.error('export default from:', file, 'is not an object')
    } else {
      console.error(file, 'is not an object')
    }
    return []
  } catch (error) {
    console.error({ error, file })
    return []
  }
}

const readFiles = async (files: string[]): Promise<ErrorsICU> => {
  const errors: (ErrorICU | undefined)[] = []

  // oxlint-disable-next-line await-thenable
  for await (const file of files) {
    const extension = file.split('.').pop()

    if (extension === 'json') {
      errors.push(...(await handleJson(file)))
    }

    if (extension === 'ts' || extension === 'js') {
      errors.push(...(await handleFile(file)))
    }
  }

  return errors
}

if (typeof pattern !== 'string' || pattern.length === 0) {
  console.error('Missing pattern: validate-icu-locales [PATTERN]')
  process.exit(1)
}

const mergeIgnore = (value: string | readonly string[] | undefined): readonly string[] => {
  if (value === undefined) {
    return []
  }

  if (typeof value === 'string') {
    return [value]
  }

  return value
}

// Taken from https://superchupu.dev/tinyglobby/migration#gitignore
const globWithGitignore = async (patterns: string, opts: Omit<GlobOptions, 'patterns'> = {}) => {
  const { cwd = process.cwd(), ...restOptions } = opts

  try {
    const gitIgnored = execSync('git ls-files --others --ignored --exclude-standard --directory', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split('\n')
      .filter(Boolean)
      .map(p => escapePath(p))

    const existingIgnore = mergeIgnore(restOptions.ignore)

    const ignore = [...existingIgnore, ...gitIgnored]

    return await glob(patterns, {
      ...restOptions,
      cwd,
      ignore,
    })
  } catch {
    return glob(patterns, opts)
  }
}

const files = await globWithGitignore(pattern, { absolute: true })

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
