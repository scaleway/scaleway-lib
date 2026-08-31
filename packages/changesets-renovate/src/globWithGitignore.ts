#!/usr/bin/env node

import { execSync } from 'node:child_process'
import type { GlobOptions } from 'tinyglobby'
import { glob, escapePath } from 'tinyglobby'

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

    const existingIgnore: readonly string[] =
      restOptions.ignore === undefined
        ? []
        : Array.isArray(restOptions.ignore)
          ? restOptions.ignore
          : [restOptions.ignore]

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
