import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { read } from '@changesets/config'
import { glob } from 'tinyglobby'
import { parse } from 'yaml'

function shouldSkipPackage(
  packageJson: { version?: string; name: string; private?: boolean },
  {
    ignore,
    allowPrivatePackages,
  }: {
    ignore: readonly string[]
    allowPrivatePackages: boolean
  },
) {
  if (ignore?.includes(packageJson.name)) {
    return true
  }

  if (packageJson.private && !allowPrivatePackages) {
    return true
  }

  return !packageJson.version
}

export async function getChangesetconfig() {
  return read(process.cwd())
}

export async function getPackagesNames(files: string[]): Promise<string[]> {
  const config = await getChangesetconfig()
  const packages: string[] = []

  const promises = files.map(async file => {
    const data = JSON.parse(await readFile(file, 'utf8')) as {
      name: string
      workspaces?: string[]
      version?: string
    }

    if (shouldSkipPackage(data, { ignore: config.ignore, allowPrivatePackages: config.privatePackages.version })) {
      return
    }

    // Do not generate changeset for the root package.json of a monorepo
    if (!data.workspaces && data.version) {
      packages.push(data.name)
    }
  })

  await Promise.all(promises)

  return packages
}

/**
 * Load catalog from a YAML file
 * @param filePath Path to the YAML file containing the catalog
 * @returns Catalog object or empty object if not found
 */
export async function loadCatalogFromFile(filePath: string): Promise<Record<string, string>> {
  try {
    const content = await readFile(filePath, 'utf8')
    const parsed = parse(content) as {
      catalog?: Record<string, string>
    } | null

    return parsed?.catalog ?? {}
  } catch {
    // Silently ignore errors in production code
    // Tests can check for specific error cases
    return {}
  }
}

/**
 * Load catalog from pnpm workspace YAML content
 * @param content Content of the pnpm-workspace.yaml file
 * @returns Catalog object or empty object if not found
 */
export function loadCatalogFromWorkspaceContent(content: string): Record<string, string> {
  try {
    const parsed = parse(content) as {
      catalog?: Record<string, string>
    } | null

    return parsed?.catalog ?? {}
  } catch {
    // Silently ignore errors in production code
    // Tests can check for specific error cases
    return {}
  }
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
    .filter(([pkg, newVersion]) => oldCatalog[pkg] && oldCatalog[pkg] !== newVersion)
    .map(([pkg]) => pkg)
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

  const config = await getChangesetconfig()
  const packageJsonPaths = await glob(packageJsonGlob, { expandDirectories: false })
  const affectedPackages = new Set<string>()

  for (const pkgJsonPath of packageJsonPaths) {
    try {
      const json = JSON.parse(await readFile(pkgJsonPath, 'utf8')) as {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
        peerDependencies?: Record<string, string>
        name: string
      }
      const deps = {
        ...json.dependencies,
        ...json.devDependencies,
        ...json.peerDependencies,
      }

      if (shouldSkipPackage(json, { ignore: config.ignore, allowPrivatePackages: config.privatePackages.version })) {
        break
      }

      for (const dep of changedDeps) {
        if (deps[dep]) {
          const dirName = path.basename(path.dirname(pkgJsonPath))
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
