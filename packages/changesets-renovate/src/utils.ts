import { readFile } from 'node:fs/promises'
import { env } from 'node:process'
import { readConfig } from '@changesets/config'
import { parse } from 'yaml'
import { globWithGitignore } from './globWithGitignore'

type PackageJson = {
  name: string
  version?: string
  workspaces?:
    | string[]
    | {
        packages?: string[]
      }
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  private?: boolean
  [key: string]: unknown
}

type PnpmWorkspaceYaml = {
  packages: string[]
  catalog?: Record<string, string>
}

export const isPackageJson = (value: unknown): value is PackageJson => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const obj = value as Record<string, unknown>
  return typeof obj['name'] === 'string'
}

const readPackageJson = async (file: string) => {
  const content = await readFile(file, 'utf8')
  const rawJson: unknown = JSON.parse(content)

  if (!isPackageJson(rawJson)) {
    throw new Error(`invalid package.json in ${file}`)
  }

  return rawJson
}

export const isPnpmWorkspaceYaml = (value: unknown): value is PnpmWorkspaceYaml => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const obj = value as Record<string, unknown>
  return 'packages' in obj && Array.isArray(obj['packages'])
}

const readPnpmWorkspaceYaml = async (file: string) => {
  const content = await readFile(file, 'utf8')
  const rawYaml: unknown = parse(content)

  if (!isPnpmWorkspaceYaml(rawYaml)) {
    throw new Error(`invalid pnpm-workspace.yaml in ${file}`)
  }

  return rawYaml
}

/**
 * Discover workspace package globs from pnpm-workspace.yaml (`packages` field)
 * and/or the root package.json (`workspaces` field).
 *
 * Supports both npm/yarn workspaces (string or string[] or { packages: [] })
 * and pnpm workspaces. Each returned glob is normalized to point at a
 * package.json file (e.g. the glob `packages` with a star wildcard becomes
 * `packages/<star>/package.json`).
 *
 * @returns Array of glob patterns pointing to package.json files. Falls back
 * to the default `packages/<star>/package.json` pattern when no workspace
 * config is found.
 */
export async function getWorkspacePackageGlobs(): Promise<string[]> {
  const globs: string[] = []

  // 1. pnpm-workspace.yaml `packages:` field
  try {
    const pnpmWorkspaceYaml = await readPnpmWorkspaceYaml('pnpm-workspace.yaml')

    globs.push(...pnpmWorkspaceYaml.packages.map(pkg => `${pkg.replace(/\/$/v, '')}/package.json`))
  } catch {
    // pnpm-workspace.yaml may not exist (npm/yarn monorepo)
  }

  // 2. Root package.json `workspaces` field (npm/yarn)
  try {
    const packageJson = await readPackageJson('package.json')

    const workspaces = Array.isArray(packageJson.workspaces) ? packageJson.workspaces : packageJson.workspaces?.packages

    if (workspaces !== undefined) {
      globs.push(...workspaces.map(pkg => `${pkg.replace(/\/$/v, '')}/package.json`))
    }
  } catch {
    // Root package.json may not exist or be unreadable
  }

  // Deduplicate while preserving order
  return [...new Set(globs)]
}

function shouldSkipPackage(
  packageJson: PackageJson,
  {
    ignore,
    allowPrivatePackages,
  }: {
    ignore: readonly string[]
    allowPrivatePackages: boolean
  },
) {
  if (ignore.includes(packageJson.name)) {
    return true
  }

  if (packageJson.private === true && !allowPrivatePackages) {
    return true
  }

  return packageJson.version === undefined || packageJson.version === ''
}

export async function getChangesetConfig(): Promise<NonNullable<Awaited<ReturnType<typeof readConfig>>['config']>> {
  const result = await readConfig(process.cwd())

  if (result.errors?.length !== undefined && result.errors.length > 0) {
    throw new Error(`Invalid changeset config:\n${result.errors.join('\n')}`)
  }

  if (!result.config) {
    throw new Error('Invalid changeset config: no config returned')
  }

  return result.config
}

export async function getPackagesNames(files: string[], packageBumps: Map<string, string>): Promise<string[]> {
  const config = await getChangesetConfig()
  const packages: string[] = []

  const promises = files.map(async file => {
    const packageJson = await readPackageJson(file)

    const packageJsonDeps = new Set([
      ...Object.keys(packageJson.dependencies ?? {}),
      ...('EXCLUDE_DEVDEPS' in env && env['EXCLUDE_DEVDEPS'] === 'true'
        ? []
        : Object.keys(packageJson.devDependencies ?? {})),
    ])

    if (!packageBumps.keys().some(value => packageJsonDeps.has(value))) {
      return
    }

    if (
      shouldSkipPackage(packageJson, { ignore: config.ignore, allowPrivatePackages: config.privatePackages.version })
    ) {
      return
    }

    // Do not generate changeset for the root package.json of a monorepo
    if (!packageJson.workspaces && packageJson.version !== undefined && packageJson.version !== '') {
      packages.push(packageJson.name)
    }
  })

  await Promise.all(promises)

  return packages
}

/**
 * Find changed dependencies between two catalogs
 * @param oldCatalog The previous catalog
 * @param newCatalog The current catalog
 * @returns Array of package names that have changed
 */
export function findChangedDependencies(
  oldCatalog: Record<string, string>,
  newCatalog: Record<string, string>,
): string[] {
  return Object.entries(newCatalog)
    .filter(([pkg, newVersion]) => pkg in oldCatalog && oldCatalog[pkg] !== newVersion)
    .map(([pkg]) => pkg)
}

const findAffectedDepsInPackageJson = async (
  pkgJsonPath: string,
  changedDeps: string[],
  config: Awaited<ReturnType<typeof getChangesetConfig>>,
) => {
  const affectedPackages = new Set<string>()

  const packageJson = await readPackageJson(pkgJsonPath)

  const packageJsonDeps = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...('EXCLUDE_DEVDEPS' in env && env['EXCLUDE_DEVDEPS'] === 'true'
      ? []
      : Object.keys(packageJson.devDependencies ?? {})),
  ])

  if (
    changedDeps.some(value => packageJsonDeps.has(value)) &&
    !shouldSkipPackage(packageJson, { ignore: config.ignore, allowPrivatePackages: config.privatePackages.version })
  ) {
    for (const dep of changedDeps) {
      if (packageJsonDeps.has(dep)) {
        affectedPackages.add(packageJson.name)
      }
    }
  }

  return [...affectedPackages]
}

/**
 * Find packages affected by dependency changes
 * @param changedDeps Array of changed dependency names
 * @param packageJsonGlobs Glob patterns to find package.json files. When
 * omitted, workspace globs are auto-discovered from pnpm-workspace.yaml and
 * the root package.json, falling back to the default `packages/<star>/package.json`.
 * @returns Set of package names that are affected by the changes
 */
export async function findAffectedPackages(changedDeps: string[], packageJsonGlobs?: string[]): Promise<Set<string>> {
  if (changedDeps.length === 0) {
    return new Set()
  }

  const globs = packageJsonGlobs && packageJsonGlobs.length > 0 ? packageJsonGlobs : await getWorkspacePackageGlobs()

  // Fall back to a sensible default if nothing was discovered
  const patterns = globs.length > 0 ? globs : ['packages/*/package.json']

  const config = await getChangesetConfig()
  const packageJsonPaths = await globWithGitignore(patterns, { expandDirectories: false })
  const affectedPackages = new Set<string>()

  for (const pkgJsonPath of packageJsonPaths) {
    try {
      // Sequential is intended here
      // oxlint-disable-next-line no-await-in-loop
      const affectedDeps = await findAffectedDepsInPackageJson(pkgJsonPath, changedDeps, config)
      affectedDeps.forEach(item => {
        affectedPackages.add(item)
      })
    } catch {
      // Silently ignore errors in production code
      // Tests can check for specific error cases
    }
  }

  return affectedPackages
}
