// oxlint-disable eslint/no-console
import { readFile } from 'node:fs/promises'
import { env } from 'node:process'
import fg from 'fast-glob'
import { load } from 'js-yaml'
import { simpleGit } from 'simple-git'

const { globSync } = fg

/**
 * Load catalog from pnpm workspace file at specific git revision
 * @param revision Git revision to load file from (default: HEAD)
 * @param filePath Path to the pnpm workspace file (default: pnpm-workspace.yaml)
 * @returns Catalog object or empty object if not found
 */
export async function loadCatalogFromGit(
  revision = 'HEAD',
  filePath = 'pnpm-workspace.yaml',
): Promise<Record<string, string>> {
  try {
    // Handle case where revision might be undefined
    if (!revision) {
      return {}
    }

    const git = simpleGit()
    const content = await git.show([`${revision}:${filePath}`])
    const parsed = load(content) as {
      catalog?: Record<string, string>
    } | null

    return parsed?.catalog || {}
  } catch {
    // Silently ignore errors in production code
    // Tests can check for specific error cases
    return {}
  }
}

/**
 * Find changed dependencies between two git revisions of pnpm workspace
 * @param oldRevision The previous git revision
 * @param newRevision The current git revision (default: HEAD)
 * @param filePath Path to the pnpm workspace file (default: pnpm-workspace.yaml)
 * @returns Array of package names that have changed
 */
export async function findChangedDependenciesFromGit(
  oldRevision: string,
  newRevision = 'HEAD',
  filePath = 'pnpm-workspace.yaml',
): Promise<Map<string, string>> {
  const oldCatalog = await loadCatalogFromGit(oldRevision, filePath)
  const newCatalog = await loadCatalogFromGit(newRevision, filePath)

  const bumps = new Map()
  Object.entries(newCatalog)
    .filter(
      ([pkg, newVersion]) => oldCatalog[pkg] && oldCatalog[pkg] !== newVersion,
    )
    .forEach(([pkg, newVersion]) => {
      bumps.set(pkg, newVersion)
    })

  return bumps
}

export async function getBumpsFromGit(
  files: string[],
): Promise<Map<string, string>> {
  const bumps = new Map()

  const promises = files.map(async file => {
    const changes = await simpleGit().show([file])

    for (const change of changes.split('\n')) {
      if (change.startsWith('+ ')) {
        const match = change.match(/"(.*?)"/g)

        if (match?.[0] && match[1]) {
          bumps.set(match[0].replace(/"/g, ''), match[1].replace(/"/g, ''))
        }
      }
    }
  })

  await Promise.all(promises)

  return bumps
}

/**
 * Find packages affected by dependency changes
 * @param changedDeps Array of changed dependency names
 * @param packageJsonGlob Glob pattern to find package.json files
 * @returns Set of package names that are affected by the changes
 */
export async function findAffectedPackages(
  changedDeps: string[],
  packageJsonGlob = 'packages/*/package.json',
): Promise<Set<string>> {
  if (changedDeps.length === 0) {
    return new Set()
  }

  const packageJsonPaths = globSync(packageJsonGlob)
  const affectedPackages = new Set<string>()

  for (const pkgJsonPath of packageJsonPaths) {
    try {
      const json = JSON.parse(await readFile(pkgJsonPath, 'utf8')) as {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
        peerDependencies?: Record<string, string>
      }
      const deps = {
        ...json.dependencies,
        ...json.devDependencies,
        ...json.peerDependencies,
      }

      for (const dep of changedDeps) {
        if (deps[dep]) {
          const path = pkgJsonPath.split('/')
          const dirName = path.at(-2) || ''
          affectedPackages.add(dirName)
          break // No need to check other deps for this package
        }
      }
    } catch {
      // Silently ignore errors in production code
      // Tests can check for specific error cases
    }
  }

  return affectedPackages
}

export async function handleChangesetFile(fileName: string) {
  if (!env['SKIP_COMMIT']) {
    await simpleGit().add(fileName)
    await simpleGit().commit(`chore: add ${fileName}`)
    await simpleGit().push()
  }
}
