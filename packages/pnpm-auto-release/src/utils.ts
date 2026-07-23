import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

// oxlint-disable eslint/no-console

type RawPackage = {
  name: string
  path: string
  version?: string
  private?: boolean
}

export type WorkspacePackage = {
  name: string
  path: string
  relativePath: string
  version: string
  private: boolean
}

export const findWorkspaceRoot = (start: string): string => {
  let dir = start
  while (dir !== '/') {
    try {
      readFileSync(join(dir, 'pnpm-workspace.yaml'), 'utf8')
      return dir
    } catch {
      dir = join(dir, '..')
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
  return (out ?? '').trim()
}

export const listWorkspacePackages = (root: string): WorkspacePackage[] => {
  const raw = exec('pnpm ls -r --depth -1 --json', { cwd: root })
  const packages = JSON.parse(raw) as RawPackage[]
  return packages
    .filter((e): e is RawPackage & { version: string } => Boolean(e.version))
    .map(e => ({
      name: e.name,
      path: e.path,
      relativePath: relative(root, e.path),
      version: e.version,
      private: e.private === true,
    }))
}

export const createTags = ({
  root,
  affectedPackages,
  updatedPackages,
}: {
  root: string
  affectedPackages: WorkspacePackage[]
  updatedPackages: WorkspacePackage[]
}) => {
  for (const pkg of affectedPackages) {
    const newPkg = updatedPackages.find(({ name }) => name === pkg.name)
    if (newPkg) {
      const tag = `${pkg.name}@${newPkg.version}`
      try {
        exec(`git rev-parse -q --verify refs/tags/${tag}`, { cwd: root })
      } catch {
        exec(`git tag "${tag}"`, { cwd: root })
        console.log(`[release] tag: ${tag}`)
      }
    }
  }
}
