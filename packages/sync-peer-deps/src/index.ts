#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'
import { globSync } from 'tinyglobby'

type PackageJson = {
  name?: string
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: unknown
}

const { log, error: consoleError } = console

const SPACE_REGEX = /^\{\n(?<indent>\s+)/v

// ponytail: regex heuristic, not a full semver parser. Skips peers that express
// an intentional broad range (||, comparators, *, x-ranges) so a dev pin like
// ^19.3.0 can't clobber "18.x || 19.x" / ">=16.8". Upgrade to semver satisfies()
// if more complex drift detection is ever needed.
const BROAD_RANGE_REGEX = /\|\||[<>=]|\*|\d+\.x/v

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

const isPackageJson = (value: unknown): value is PackageJson => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const obj = value as Record<string, unknown>
  return typeof obj['name'] === 'string' && typeof obj['version'] === 'string'
}

/**
 * Process a single package.json file
 * Returns the number of changes made
 */
export async function processPackageJson(filePath: string): Promise<number> {
  try {
    // Read and parse the file
    const content = await readFile(filePath, 'utf8')
    const rawJson: unknown = JSON.parse(content)

    if (!isPackageJson(rawJson)) {
      throw new Error(`invalid package.json in ${filePath}`)
    }

    const packageJson = rawJson

    // Skip if no peerDependencies or devDependencies
    if (!(packageJson.peerDependencies && packageJson.devDependencies)) {
      return 0
    }

    let changesCount = 0
    const packageName = packageJson.name ?? path.basename(path.dirname(filePath))

    // Compare and update peerDependencies
    for (const [pkg, peerVersion] of Object.entries(packageJson.peerDependencies)) {
      // Skip intentional broad ranges (e.g. "18.x || 19.x", ">=16.8") — they
      // express supported versions, not a pin that should track the dev install.
      if (BROAD_RANGE_REGEX.test(peerVersion)) {
        continue
      }

      if (packageJson.devDependencies[pkg] !== undefined && packageJson.devDependencies[pkg] !== peerVersion) {
        const devVersion = packageJson.devDependencies[pkg]

        // Skip pnpm catalog: / workspace: references — they are not publishable
        // semver and would leak an invalid version into peerDependencies.
        if (devVersion.startsWith('catalog:') || devVersion.startsWith('workspace:')) {
          continue
        }

        log(
          chalk.yellow(`Updating ${chalk.bold(pkg)} in ${chalk.cyan(packageName)}:`),
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
      const match = SPACE_REGEX.exec(content)
      const indent = match?.groups?.['indent']?.length ?? 2

      await writeFile(filePath, JSON.stringify(packageJson, undefined, indent), 'utf8')
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
      // We volontarily execute sequentially
      // oxlint-disable-next-line no-await-in-loop
      const changes = await processPackageJson(file)
      totalChanges += changes
      if (changes > 0) {
        processedFiles += 1
      }
    }

    // Summary
    if (totalChanges > 0) {
      log(chalk.green(`\n✅ Updated ${totalChanges} dependencies across ${processedFiles} files`))
    } else {
      log(chalk.green('\n✅ All peerDependencies are already in sync with devDependencies'))
    }
  } catch (error: unknown) {
    consoleError(chalk.red('Error synchronizing dependencies:'), error)
    process.exit(1)
  }
}

// Execute the main function only when run directly as a CLI entrypoint.
const isMain = import.meta.url === `file://${process.argv[1]}`

if (isMain) {
  await syncPeerDependencies().catch((error: unknown) => {
    consoleError(chalk.red('GLOBAL Error synchronizing dependencies:'), error)
  })
}
