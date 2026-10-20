#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { findFiles, validateFiles } from './validate'

const options = {
  ignoreTag: {
    default: false,
    short: 'i',
    type: 'boolean',
  },
} as const

const { values, positionals } = parseArgs({ allowPositionals: true, options })

const [pattern] = positionals

if (typeof pattern !== 'string' || pattern.length === 0) {
  console.error('Missing pattern: validate-icu-locales [PATTERN]')
  process.exit(1)
}

const files = await findFiles(pattern)

if (files.length === 0) {
  console.error('There is no files matching this pattern', pattern)
  process.exit(1)
}

console.table(files)

const errors = await validateFiles(files, { ignoreTag: values.ignoreTag })

if (errors.length > 0) {
  console.error({
    errors,
  })
  process.exit(1)
}
