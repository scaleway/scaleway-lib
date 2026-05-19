import { readFile } from 'node:fs/promises'
import { env } from 'node:process'
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

export async function getChangesetConfig(): ReturnType<typeof read> {
  return read(process.cwd())
}

export async function getPackagesNames(files: string[], packageBumps: Map<string, string>): Promise<string[]> {
  const config = await getChangesetConfig()
  const packages: string[] = []

  const promises = files.map(async file => {
    const data = JSON.parse(await readFile(file, 'utf8')) as {
      name: string
      workspaces?: string[]
      version?: string
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    const packageJsonDeps = new Set([
      ...Object.keys(data.dependencies ?? {}),
      ...(env['EXCLUDE_DEVDEPS'] ? [] : Object.keys(data.devDependencies ?? {})),
    ])

    if (!packageBumps.keys().some(value => packageJsonDeps.has(value))) {
      return
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

  const config = await getChangesetConfig()
  const packageJsonPaths = await glob(packageJsonGlob, { expandDirectories: false })
  const affectedPackages = new Set<string>()

  for (const pkgJsonPath of packageJsonPaths) {
    try {
      const json = JSON.parse(await readFile(pkgJsonPath, 'utf8')) as {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
        name: string
      }

      const packageJsonDeps = new Set([
        ...Object.keys(json.dependencies ?? {}),
        ...(env['EXCLUDE_DEVDEPS'] ? [] : Object.keys(json.devDependencies ?? {})),
      ])

      if (
        changedDeps.some(value => packageJsonDeps.has(value)) &&
        !shouldSkipPackage(json, { ignore: config.ignore, allowPrivatePackages: config.privatePackages.version })
      ) {
        for (const dep of changedDeps) {
          if (packageJsonDeps.has(dep)) {
            affectedPackages.add(json.name)
          }
        }
      }
    } catch {
      // Silently ignore errors in production code
      // Tests can check for specific error cases
    }
  }

  return affectedPackages
}
