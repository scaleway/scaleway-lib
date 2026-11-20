import { env } from 'node:process'
import { simpleGit } from 'simple-git'
import { handleCatalogChanges } from './handle-catalog.ts'
import { handlePackageChanges } from './handle-packages.ts'

async function run(): Promise<void> {
  // Original Renovate mode
  const branch = await simpleGit().branch()
  const branchPrefix = env['BRANCH_PREFIX'] ?? 'renovate/'

  console.log('Detected branch:', branch.current)

  if (
    !(branch.current.startsWith(branchPrefix) || ('SKIP_BRANCH_CHECK' in env && env['SKIP_BRANCH_CHECK'] === 'true'))
  ) {
    console.log('Not a renovate branch, skipping')

    return
  }

  // GITHUB_BASE_REF is set by GitHub Actions on pull_request events. Without it
  // (local runs), fall back to the previous commit, which only sees single-commit PRs.
  const base = env['GITHUB_BASE_REF'] === undefined ? undefined : `origin/${env['GITHUB_BASE_REF']}`

  const diffOutput = await simpleGit().diffSummary(['--name-only', `${base ?? 'HEAD~1'}...HEAD`])
  const diffFiles = diffOutput.files.map(file => file.file)

  console.log('Found changed files:', diffFiles)

  if (diffFiles.some(f => f.startsWith('.changeset'))) {
    console.log('Changeset already exists, skipping')

    return
  }

  // Handle both package.json changes and catalog changes
  const hasPackageChanges = diffFiles.some(file => file.includes('package.json'))
  const hasWorkspaceChanges = diffFiles.some(file => file.includes('pnpm-workspace.yaml'))

  if (!(hasPackageChanges || hasWorkspaceChanges)) {
    console.log('No relevant changes detected, skipping')

    return
  }

  // Handle catalog changes
  if (hasWorkspaceChanges) {
    console.log('📚 Processing pnpm workspace catalog changes...')
    await handleCatalogChanges(diffFiles, base)
  }

  // Handle package.json changes
  if (hasPackageChanges) {
    console.log('📦 Processing package.json changes...')
    await handlePackageChanges(diffFiles, base)
  }
}

export { run }
