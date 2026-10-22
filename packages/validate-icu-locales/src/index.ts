#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { glob, readFile, stat } from 'node:fs/promises'
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

// Mirrors tinyglobby's default `expandDirectories: true`: a literal, non-glob
// pattern (e.g. a bare directory) is expanded to `<pattern>/**`. node:glob
// doesn't do this on its own and has no `onlyFiles`, so we filter to files.
// Only node:glob's true wildcards make a pattern dynamic; `(` `)` `!` `|` are
// literal mid-pattern so a path like `packages/e/!bang` stays expandable.
const isGlobPattern = (globPattern: string): boolean => /[*?\[\]\{\}]/v.test(globPattern)

// node:glob's array `exclude` re-tests every walked path against every pattern,
// which was ~27x slower than tinyglobby's pruned walk on this repo. Gitignored
// paths are literals, so checking a path's ancestors against a Set is
// equivalent and cheap. Only literal paths can be excluded this way; glob
// exclude patterns would need node:glob's `exclude` again.
const globFiles = async (globPattern: string, ignored: ReadonlySet<string> = new Set()) => {
  const cwd = process.cwd()
  const expanded = isGlobPattern(globPattern) ? globPattern : `${globPattern.replace(/\/+$/v, '')}/**`

  const isIgnored = (relPath: string): boolean => {
    const segments = relPath.split('/')
    for (let i = 1; i <= segments.length; i++) {
      if (ignored.has(segments.slice(0, i).join('/'))) {
        return true
      }
    }
    return false
  }

  const files: string[] = []
  for await (const entry of glob(expanded, { cwd, withFileTypes: true })) {
    // tinyglobby followed symlinks: keep a link only when it resolves to a file
    if (!entry.isFile()) {
      if (!entry.isSymbolicLink()) {
        continue
      }

      const isFile = await stat(path.join(entry.parentPath, entry.name)).then(
        s => s.isFile(),
        () => false, // broken link
      )
      if (!isFile) {
        continue
      }
    }

    const relPath = path.relative(cwd, path.join(entry.parentPath, entry.name))
    if (!isIgnored(relPath)) {
      files.push(relPath)
    }
  }

  return files
}

const globWithGitignore = async (globPattern: string) => {
  let ignored: ReadonlySet<string> = new Set()

  try {
    ignored = new Set(
      execSync('git ls-files --others --ignored --exclude-standard --directory', {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .split('\n')
        .filter(Boolean)
        .map(p => p.replace(/\/+$/v, '')),
    )
  } catch {
    // not a git repository: nothing is ignored
  }

  return globFiles(globPattern, ignored)
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
