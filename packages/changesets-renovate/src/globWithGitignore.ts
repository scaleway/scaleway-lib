#!/usr/bin/env node

import { execSync } from 'node:child_process'
import type { GlobOptions } from 'tinyglobby'
import { escapePath, glob } from 'tinyglobby'

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
export const globWithGitignore = async (patterns: string[], opts: Omit<GlobOptions, 'patterns'> = {}) => {
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
