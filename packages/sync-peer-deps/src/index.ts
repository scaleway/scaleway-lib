#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import chalk from 'chalk'
import { globSync } from 'tinyglobby'

type PackageJson = {
  name?: string
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: unknown
}

const { log, error: consoleError } = console

const SPACE_REGEX = /^\{\n(\s+)/

/**
 * Find all package.json files recursively
 */
function findPackageJsonFiles(cwd: string): string[] {
  try {
    // Exclude node_modules folders
    const files = globSync(['**/package.json', '!**/node_modules/**'], {
      absolute: true,
      cwd,
    })
    return files
  } catch (error) {
    consoleError(chalk.red('Error finding package.json files:'), error)
    return []
  }
}

/**
 * Process a single package.json file
 * Returns the number of changes made
 */
async function processPackageJson(filePath: string): Promise<number> {
  try {
    // Read and parse the file
    const content = await readFile(filePath, 'utf8')
    const packageJson = JSON.parse(content) as PackageJson

    // Skip if no peerDependencies or devDependencies
    if (!(packageJson.peerDependencies && packageJson.devDependencies)) {
      return 0
    }

    let changesCount = 0
    const packageName = packageJson.name ?? basename(dirname(filePath))

    // Compare and update peerDependencies
    for (const [pkg, peerVersion] of Object.entries(
      packageJson.peerDependencies,
    )) {
      if (
        packageJson.devDependencies[pkg] &&
        packageJson.devDependencies[pkg] !== peerVersion
      ) {
        const devVersion = packageJson.devDependencies[pkg]
        log(
          chalk.yellow(
            `Updating ${chalk.bold(pkg)} in ${chalk.cyan(packageName)}:`,
          ),
          chalk.red(peerVersion),
          chalk.gray('→'),
          chalk.green(devVersion),
        )

        // Update peerDependency to match devDependency
        packageJson.peerDependencies[pkg] = devVersion
        changesCount += 1
      }
    }

    // Save changes if any were made
    if (changesCount > 0) {
      // Preserve formatting by using the same space count as the original file
      const match = content.match(SPACE_REGEX)
      const indent = match?.[1]?.length ?? 2

      await writeFile(
        filePath,
        JSON.stringify(packageJson, undefined, indent),
        'utf8',
      )
    }

    return changesCount
  } catch (error) {
    consoleError(chalk.red(`Error processing ${filePath}:`), error)
    return 0
  }
}

/**
 * Main function to synchronize peerDependencies with devDependencies
 */
async function syncPeerDependencies(): Promise<void> {
  try {
    log(chalk.blue('🔍 Finding package.json files...'))

    // Get current working directory
    const cwd = process.cwd()
    const files = findPackageJsonFiles(cwd)

    log(chalk.blue(`Found ${files.length} package.json files`))

    let totalChanges = 0
    let processedFiles = 0

    // Process each package.json file
    for (const file of files) {
      const changes = await processPackageJson(file)
      totalChanges += changes
      if (changes > 0) {
        processedFiles += 1
      }
    }

    // Summary
    if (totalChanges > 0) {
      log(
        chalk.green(
          `\n✅ Updated ${totalChanges} dependencies across ${processedFiles} files`,
        ),
      )
    } else {
      log(
        chalk.green(
          '\n✅ All peerDependencies are already in sync with devDependencies',
        ),
      )
    }
  } catch (error: unknown) {
    consoleError(chalk.red('Error synchronizing dependencies:'), error)
    process.exit(1)
  }
}

// Execute the main function
await syncPeerDependencies().catch((error: unknown) => {
  consoleError(chalk.red('GLOBAL Error synchronizing dependencies:'), error)
})
