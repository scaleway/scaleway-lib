#!/usr/bin/env node

/**
 * Script to check that dependencies use catalog references instead of hardcoded versions
 */

import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { readPackageJson, readPnpmWorkspaceYaml } from './utils.ts'

const dirName = import.meta.dirname

// Define types
type WorkspaceData = {
  catalog?: Record<string, string>
}

type DependencyError = {
  pkgName: string
  filePath: string
  version: string
}

// Function to get catalog packages from pnpm-workspace.yaml
function getCatalogPackages(workspacePath: string): string[] {
  const workspaceData = readPnpmWorkspaceYaml(workspacePath)

  const catalogPackages: string[] = []
  if (workspaceData.catalog) {
    for (const packageName of Object.keys(workspaceData.catalog)) {
      catalogPackages.push(packageName)
    }
  }

  return catalogPackages
}

// Function to check dependencies in a package.json file
// oxlint-disable-next-line max-params
function checkDependencies(
  deps: Record<string, string> | undefined,
  filePath: string,
  catalogPackages: string[],
  errors: DependencyError[],
): void {
  if (!deps) {
    return
  }

  for (const [pkgName, version] of Object.entries(deps)) {
    if (catalogPackages.includes(pkgName) && version !== 'catalog:') {
      console.error(`❌ Error: Package "${pkgName}" in "${filePath}" should use "catalog:" but uses "${version}"`)
      errors.push({ filePath, pkgName, version })
    }
  }
}

// Function to find the workspace file
function findWorkspaceFile(startDir: string = dirName): string {
  let currentDir = startDir

  console.debug('findWorkspaceFile', startDir)
  // Traverse up the directory tree to find pnpm-workspace.yaml
  while (currentDir !== path.parse(currentDir).root) {
    const workspacePath = path.join(currentDir, 'pnpm-workspace.yaml')
    if (existsSync(workspacePath)) {
      return workspacePath
    }
    currentDir = path.dirname(currentDir)
  }

  // If not found, try the conventional location
  const rootWorkspacePath = path.join(dirName, '..', '..', 'pnpm-workspace.yaml')
  if (existsSync(rootWorkspacePath)) {
    return rootWorkspacePath
  }

  throw new Error('Could not find pnpm-workspace.yaml')
}

// Main function
function main(): Promise<void> | void {
  try {
    const workspacePath = findWorkspaceFile()
    const rootDir = path.dirname(workspacePath)
    const rootPackageJsonPath = path.join(rootDir, 'package.json')

    // Get catalog packages
    const catalogPackages = getCatalogPackages(workspacePath)

    console.log('Catalog packages found:', catalogPackages)

    // Check root package.json
    const rootPackageJson = readPackageJson(rootPackageJsonPath)
    const errors: DependencyError[] = []

    checkDependencies(rootPackageJson.dependencies, 'package.json', catalogPackages, errors)
    checkDependencies(rootPackageJson.devDependencies, 'package.json', catalogPackages, errors)

    // Check packages/*/package.json files
    const packagesDir = path.join(rootDir, 'packages')
    const packageDirs = readdirSync(packagesDir).filter(
      file => statSync(path.join(packagesDir, file)).isDirectory() && file !== 'utils', // Skip the utils package itself
    )

    for (const pkgDir of packageDirs) {
      const pkgJsonPath = path.join(packagesDir, pkgDir, 'package.json')
      if (existsSync(pkgJsonPath)) {
        try {
          const pkgJson = readPackageJson(pkgJsonPath)
          checkDependencies(pkgJson.dependencies, `packages/${pkgDir}/package.json`, catalogPackages, errors)
          checkDependencies(pkgJson.devDependencies, `packages/${pkgDir}/package.json`, catalogPackages, errors)
        } catch (error) {
          console.error(`Error reading ${pkgJsonPath}:`, error instanceof Error ? error.message : String(error))
        }
      }
    }

    if (errors.length > 0) {
      console.error('\n❌ Found dependencies that should use catalog: references')
      process.exit(1)
    } else {
      console.log('\n✅ All catalog packages are properly referenced')
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await main()
  } catch {
    // Intentionally left empty to satisfy no-floating-promises rule
  }
}

// Export for programmatic use
export { getCatalogPackages, checkDependencies, main, findWorkspaceFile }
export type { WorkspaceData, DependencyError }
export default main
