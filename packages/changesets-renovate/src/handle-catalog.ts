// oxlint-disable eslint/max-statements
// oxlint-disable eslint/no-console
import { simpleGit } from 'simple-git'
import { createChangeset } from './createChangeset.js'

const {
  findChangedDependenciesFromGit,
  findAffectedPackages,
  handleChangesetFile,
} = await import('./git-utils.js')
/**
 * Handle pnpm workspace catalog changes
 */
export async function handleCatalogChanges(diffFiles: string[]): Promise<void> {
  const workspaceFiles = diffFiles.filter(file =>
    file.includes('pnpm-workspace.yaml'),
  )

  if (workspaceFiles.length === 0) {
    return
  }

  console.log(
    '🔍 Detected pnpm workspace changes, checking for catalog updates...',
  )

  // Compare catalogs between HEAD~1 and HEAD
  console.log('🔍 Comparing catalogs: HEAD~1 -> HEAD')

  // Step 1: Find changed deps using git history
  const changedDeps = await findChangedDependenciesFromGit(
    'HEAD~1',
    'HEAD',
    'pnpm-workspace.yaml',
  )

  if (changedDeps.size === 0) {
    console.log('✅ No catalog dependency changes.', { changedDeps })

    return
  }

  console.log('📦 Changed dependencies:', changedDeps)

  // Step 2: Find affected packages
  const affectedPackages = await findAffectedPackages([...changedDeps.keys()])

  if (affectedPackages.size === 0) {
    console.log('📦 No packages affected by catalog changes.')

    return
  }

  console.log('\n📝 Affected packages:')
  for (const pkg of affectedPackages) {
    console.log(`  - ${pkg}`)
  }

  // Step 3: Generate changesets
  console.log('\n✏️  Creating changesets...')
  const packageNames = [...affectedPackages.keys()]
  const shortHash = (await simpleGit().revparse(['--short', 'HEAD'])).trim()
  const fileName = `.changeset/renovate-${shortHash}.md`
  await createChangeset(fileName, changedDeps, packageNames)
  await handleChangesetFile(fileName)

  console.log('\n✅ Done creating changesets.')
}
