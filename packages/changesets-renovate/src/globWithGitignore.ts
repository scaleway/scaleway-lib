#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { glob } from 'node:fs/promises'

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

export const globWithGitignore = async (
  patterns: string[],
  opts: {
    cwd?: string
    expandDirectories?: never
    exclude?: string | readonly string[]
  } = {},
) => {
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

    const existingIgnore = mergeIgnore(restOptions.exclude)

    const exclude = [...existingIgnore, ...gitIgnored]

    const files: string[] = []
    for await (const file of glob(patterns, {
      ...restOptions,
      cwd,
      exclude,
    })) {
      files.push(file)
    }

    return files
  } catch {
    const files: string[] = []
    for await (const file of glob(patterns, { ...restOptions, cwd, exclude: mergeIgnore(restOptions.exclude) })) {
      files.push(file)
    }

    return files
  }
}
