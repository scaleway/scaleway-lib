import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

type Package = {
  name: string
  path: string
  version?: string
  private?: boolean
}

const hasPnpm = (() => {
  try {
    execSync('pnpm --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
})()

export const findWorkspaceRoot = (start: string): string => {
  let dir = start
  while (dir !== '/') {
    try {
      readFileSync(path.join(dir, 'pnpm-workspace.yaml'), 'utf8')
      return dir
    } catch {
      dir = path.join(dir, '..')
    }
  }
  return start
}

export const exec = (cmd: string, opts: { cwd?: string; stdio?: 'pipe' | 'inherit' } = {}): string => {
  const out = execSync(cmd, {
    cwd: opts.cwd,
    encoding: 'utf8',
    stdio: opts.stdio === 'inherit' ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024,
  })
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  return (out ?? '').trim()
}

type PnpmListEntry = {
  name: string
  path: string
  version?: string
  private?: boolean
}

const isPnpmListEntry = (e: unknown): e is PnpmListEntry =>
  typeof e === 'object' && e !== null && 'name' in e && 'path' in e

export const listPublicWorkspacePackages = (root: string): Package[] => {
  const raw = exec('pnpm ls -r --depth -1 --json', { cwd: root })
  const parsed: unknown = JSON.parse(raw)
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  return (Array.isArray(parsed) ? parsed : []).filter(isPnpmListEntry).filter(e => e.version && e.private !== true)
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const countTrustEntries = (json: string): number => {
  try {
    const parsed: unknown = JSON.parse(json)
    if (!isRecord(parsed)) {
      return 0
    }
    const entries = Object.values(parsed).flat().filter(Boolean)
    return entries.length
  } catch {
    return 0
  }
}

export const hasExistingTrust = (pkgName: string): boolean => {
  try {
    const listJson = exec(`npm trust list ${pkgName} --json --force`)
    return countTrustEntries(listJson) > 0
  } catch {
    return false
  }
}

export const isPackagePublished = (pkgName: string): boolean => {
  const cmd = hasPnpm ? `pnpm view ${pkgName} version` : `npm view ${pkgName} version --force`
  try {
    exec(cmd)
    return true
  } catch {
    return false
  }
}
