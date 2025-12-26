// oxlint-disable eslint/max-statements
// oxlint-disable eslint/no-console
import { simpleGit } from 'simple-git'
import { createChangeset } from './createChangeset.js'
import { getBumpsFromGit, handleChangesetFile } from './git-utils.js'
import { getPackagesNames } from './utils.js'

/**
 * Handle package.json changes (original Renovate flow)
 */
export async function handlePackageChanges(diffFiles: string[]): Promise<void> {
  const files = diffFiles.filter(file => file.includes('package.json'))

  if (files.length === 0) {
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
  const packageBumps = await getBumpsFromGit(files)

  await createChangeset(fileName, packageBumps, packageNames)
  await handleChangesetFile(fileName)
}
