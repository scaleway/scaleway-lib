#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { glob, readFile } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { parse } from '@formatjs/icu-messageformat-parser'

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
  message?: string
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
        if (error !== null && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
          const { message } = error

          return {
            filePath,
            key,
            message,
            value,
          }
        }

        return {
          filePath,
          key,
          value,
        }
      }
    })
    .filter(Boolean)

  return errors
}

export const isLocales = (value: unknown): value is Locales => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return true
}

const handleJson = async (file: string) => {
  try {
    const data = await readFile(file)
    const jsonFile = data.toString()

    const locales: unknown = JSON.parse(jsonFile)

    if (!isLocales(locales)) {
      throw new TypeError(`invalid locales file in ${file}`)
    }

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
        const { default: locales } = data

        if (!isLocales(locales)) {
          throw new TypeError(`invalid locales file in ${file}`)
        }

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

// Escapes glob metacharacters so a literal path can be used as an exclude pattern.
// node:glob has no backslash escaping on POSIX: a wildcard must be contained in a
// bracket class (`[*]` = literal `*`). `!` is not special in node's exclude patterns.
const escapePath = (p: string): string => p.replaceAll(/[*?\[\]\{\}\(\)\|]/gv, m => `[${m}]`)

// Mirrors tinyglobby's default `expandDirectories: true`: a literal, non-glob
// pattern (e.g. a bare directory) is expanded to `<pattern>/**`. node:glob
// doesn't do this on its own and has no `onlyFiles`, so we filter to files.
// Only node:glob's true wildcards make a pattern dynamic; `(` `)` `!` `|` are
// literal mid-pattern so a path like `packages/e/!bang` stays expandable.
const isGlobPattern = (globPattern: string): boolean => /[*?\[\]\{\}]/v.test(globPattern)

const globFiles = async (
  globPattern: string,
  opts: {
    cwd?: string
    exclude?: readonly string[]
  } = {},
) => {
  const { cwd = process.cwd(), exclude } = opts
  const expanded = isGlobPattern(globPattern) ? globPattern : `${globPattern.replace(/\/+$/v, '')}/**`

  const files: string[] = []
  for await (const entry of glob(expanded, { cwd, exclude, withFileTypes: true })) {
    if (entry.isFile()) {
      files.push(path.relative(cwd, path.join(entry.parentPath, entry.name)))
    }
  }

  return files
}

const globWithGitignore = async (
  globPattern: string,
  opts: {
    exclude?: string | readonly string[]
  } = {},
) => {
  const cwd = process.cwd()

  try {
    const gitIgnored = execSync('git ls-files --others --ignored --exclude-standard --directory', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split('\n')
      .filter(Boolean)
      .map(p => escapePath(p))

    const existingIgnore = mergeIgnore(opts.exclude)

    const exclude = [...existingIgnore, ...gitIgnored]

    return await globFiles(globPattern, { cwd, exclude })
  } catch {
    return await globFiles(globPattern)
  }
}

const filesGlob = await globWithGitignore(pattern)
const files = filesGlob.map(p => path.resolve(process.cwd(), p))

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
