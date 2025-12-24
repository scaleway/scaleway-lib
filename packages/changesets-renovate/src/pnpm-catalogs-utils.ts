import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import * as yaml from 'js-yaml'

const { globSync } = fg

/**
 * Load catalog from a YAML file
 * @param filePath Path to the YAML file containing the catalog
 * @returns Catalog object or empty object if not found
 */
export function loadCatalogFromFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const parsed = yaml.load(content) as {
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
 * Load catalog from pnpm workspace YAML content
 * @param content Content of the pnpm-workspace.yaml file
 * @returns Catalog object or empty object if not found
 */
export function loadCatalogFromWorkspaceContent(
  content: string,
): Record<string, string> {
  try {
    const parsed = yaml.load(content) as {
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
    .filter(
      ([pkg, newVersion]) => oldCatalog[pkg] && oldCatalog[pkg] !== newVersion,
    )
    .map(([pkg]) => pkg)
}

/**
 * Find packages affected by dependency changes
 * @param changedDeps Array of changed dependency names
 * @param packageJsonGlob Glob pattern to find package.json files
 * @returns Set of package names that are affected by the changes
 */
export function findAffectedPackages(
  changedDeps: string[],
  packageJsonGlob: string = 'packages/*/package.json',
): Set<string> {
  if (changedDeps.length === 0) {
    return new Set()
  }

  const packageJsonPaths = globSync(packageJsonGlob)
  const affectedPackages = new Set<string>()

  for (const pkgJsonPath of packageJsonPaths) {
    try {
      const json = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')) as {
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
