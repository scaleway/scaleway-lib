#!/usr/bin/env node
// oxlint-disable eslint/max-statements
// oxlint-disable eslint/no-console

import { env } from 'node:process'
import { simpleGit } from 'simple-git'
import { handleCatalogChanges } from './handle-catalog.js'
import { handlePackageChanges } from './handle-packages.js'

export async function run(): Promise<void> {
  // Original Renovate mode
  const branch = await simpleGit().branch()
  const branchPrefix = env['BRANCH_PREFIX'] ?? 'renovate/'

  console.log('Detected branch:', branch)

  if (!(branch.current.startsWith(branchPrefix) || env['SKIP_BRANCH_CHECK'])) {
    console.log('Not a renovate branch, skipping')

    return
  }

  const diffOutput = await simpleGit().diffSummary(['--name-only', 'HEAD~1'])
  const diffFiles = diffOutput.files.map(file => file.file)

  console.log('Found changed files:', diffFiles)

  // if (diffFiles.find(f => f.startsWith('.changeset'))) {
  //   console.log('Changeset already exists, skipping')

  //   return
  // }

  // Handle both package.json changes and catalog changes
  const hasPackageChanges = diffFiles.some(file =>
    file.includes('package.json'),
  )
  const hasWorkspaceChanges = diffFiles.some(file =>
    file.includes('pnpm-workspace.yaml'),
  )

  if (!(hasPackageChanges || hasWorkspaceChanges)) {
    console.log('No relevant changes detected, skipping')

    return
  }

  // Handle catalog changes
  if (hasWorkspaceChanges) {
    console.log('📚 Processing pnpm workspace catalog changes...')
    await handleCatalogChanges(diffFiles)
  }

  // Handle package.json changes
  if (hasPackageChanges) {
    console.log('📦 Processing package.json changes...')
    await handlePackageChanges(diffFiles)
  }
}

run().catch(console.error)
