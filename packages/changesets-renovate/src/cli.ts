#!/usr/bin/env node

import fs from 'node:fs/promises'
import { simpleGit } from 'simple-git'

async function getChangesetIgnoredPackages(): Promise<string[]> {
  const changesetConfig = JSON.parse(
    await fs.readFile('.changeset/config.json', 'utf8'),
  ) as {
    ignore?: string[]
  }

  return changesetConfig.ignore ?? []
}

function shouldIgnorePackage(
  packageName: string,
  ignoredPackages: string[],
): boolean {
  return ignoredPackages.some(ignoredPackage => {
    if (ignoredPackage.endsWith('*')) {
      return packageName.startsWith(ignoredPackage.slice(0, -1))
    }

    return packageName === ignoredPackage
  })
}

async function getPackagesNames(files: string[]): Promise<string[]> {
  const ignoredPackages = await getChangesetIgnoredPackages()
  const packages: string[] = []

  const promises = files.map(async file => {
    const data = JSON.parse(await fs.readFile(file, 'utf8')) as {
      name: string
      workspaces?: string[]
      version?: string
    }

    if (shouldIgnorePackage(data.name, ignoredPackages)) {
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

async function createChangeset(
  fileName: string,
  packageBumps: Map<string, string>,
  packages: string[],
): Promise<void> {
  const messageLines = []

  for (const [pkg, bump] of packageBumps) {
    messageLines.push(`Updated dependency \`${pkg}\` to \`${bump}\`.`)
  }

  if (process.env['SORT_CHANGESETS']) {
    packages.sort()
    messageLines.sort()
  }

  const message = messageLines.join('\n')
  const pkgs = packages.map(pkg => `'${pkg}': patch`).join('\n')
  const body = `---\n${pkgs}\n---\n\n${message.trim()}\n`
  await fs.writeFile(fileName, body)
}

async function getBumps(files: string[]): Promise<Map<string, string>> {
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
 * Handle package.json changes (original Renovate flow)
 */
async function handlePackageChanges(diffFiles: string[]): Promise<void> {
  const files = diffFiles.filter(file => file.includes('package.json'))

  if (!files.length) {
    console.log('No package.json changes to published packages, skipping')

    return
  }

  const packageNames = await getPackagesNames(files)

  if (packageNames.length === 0) {
    console.log('No packages modified, skipping')

    return
  }

  const shortHash = (await simpleGit().revparse(['--short', 'HEAD'])).trim()
  const fileName = `.changeset/renovate-${shortHash}.md`
  const packageBumps = await getBumps(files)

  await createChangeset(fileName, packageBumps, packageNames)
  if (!process.env['SKIP_COMMIT']) {
    await simpleGit().add(fileName)
    await simpleGit().commit(`chore: add changeset renovate-${shortHash}`)
    await simpleGit().push()
  }
}

/**
 * Handle pnpm workspace catalog changes
 */
async function handleCatalogChanges(diffFiles: string[]): Promise<void> {
  const workspaceFiles = diffFiles.filter(file =>
    file.includes('pnpm-workspace.yaml'),
  )

  if (!workspaceFiles.length) {
    return
  }

  console.log(
    '🔍 Detected pnpm workspace changes, checking for catalog updates...',
  )

  // Import the functions we need for catalogs mode
  const { findChangedDependenciesFromGit, findAffectedPackages } = await import(
    './pnpm-catalogs-git-utils.js'
  )
  const { execSync } = await import('node:child_process')

  // Compare catalogs between HEAD~1 and HEAD
  console.log('🔍 Comparing catalogs: HEAD~1 -> HEAD')

  // Step 1: Find changed deps using git history
  const changedDeps = await findChangedDependenciesFromGit(
    'HEAD~1',
    'HEAD',
    'pnpm-workspace.yaml',
  )

  if (changedDeps.length === 0) {
    console.log('✅ No catalog dependency changes.')

    return
  }

  console.log('📦 Changed dependencies:', changedDeps)

  // Step 2: Find affected packages
  const affectedPackages = findAffectedPackages(changedDeps)

  if (affectedPackages.size === 0) {
    console.log('📦 No packages affected by catalog changes.')

    return
  }

  console.log('\n📝 Affected packages:')
  Array.from(affectedPackages).forEach(pkg => {
    console.log(`  - ${pkg}`)
  })

  // Step 3: Generate changesets
  console.log('\n✏️  Creating changesets...')
  for (const pkg of affectedPackages) {
    console.log(`  Creating changeset for ${pkg}...`)
    execSync(
      `npx changeset --empty --include=${pkg} --summary="Bump dependency from catalog update"`,
      {
        stdio: 'inherit',
      },
    )
  }

  console.log('\n✅ Done creating changesets.')
}

export async function run(): Promise<void> {
  // Original Renovate mode
  const branch = await simpleGit().branch()
  const branchPrefix = process.env['BRANCH_PREFIX'] ?? 'renovate/'

  console.log('Detected branch:', branch)

  if (
    !branch.current.startsWith(branchPrefix) &&
    !process.env['SKIP_BRANCH_CHECK']
  ) {
    console.log('Not a renovate branch, skipping')

    return
  }

  const diffOutput = await simpleGit().diffSummary(['--name-only', 'HEAD~1'])
  const diffFiles = diffOutput.files.map(file => file.file)

  console.log('Found changed files:', diffFiles)

  if (diffFiles.find(f => f.startsWith('.changeset'))) {
    console.log('Changeset already exists, skipping')

    return
  }

  // Handle both package.json changes and catalog changes
  const hasPackageChanges = diffFiles.some(file =>
    file.includes('package.json'),
  )
  const hasWorkspaceChanges = diffFiles.some(file =>
    file.includes('pnpm-workspace.yaml'),
  )

  if (!hasPackageChanges && !hasWorkspaceChanges) {
    console.log('No relevant changes detected, skipping')

    return
  }

  // Handle package.json changes
  if (hasPackageChanges) {
    console.log('📦 Processing package.json changes...')
    await handlePackageChanges(diffFiles)
  }

  // Handle catalog changes
  if (hasWorkspaceChanges) {
    console.log('📚 Processing pnpm workspace catalog changes...')
    await handleCatalogChanges(diffFiles)
  }
}

run().catch(console.error)
