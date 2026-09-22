import { simpleGit } from 'simple-git'
import { createChangeset } from './createChangeset.ts'
import { getBumpsFromGit, handleChangesetFile } from './git-utils.ts'
import { getPackagesNames } from './utils.ts'

/**
 * Handle package.json changes (original Renovate flow)
 */
export async function handlePackageChanges(diffFiles: string[]): Promise<void> {
  const files = diffFiles.filter(file => file.includes('package.json'))

  if (files.length === 0) {
    console.log('No package.json changes to published packages, skipping')

    return
  }

  const packageBumps = await getBumpsFromGit(files)
  const packageNames = await getPackagesNames(files, packageBumps)

  if (packageNames.length === 0) {
    console.log('No packages modified, skipping')

    return
  }

  const shortRawHash = await simpleGit().revparse(['--short', 'HEAD'])
  const shortHash = shortRawHash.trim()
  const fileName = `.changeset/renovate-${shortHash}.md`

  await createChangeset(fileName, packageBumps, packageNames)
  await handleChangesetFile(fileName)
}
