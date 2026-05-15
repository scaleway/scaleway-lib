// oxlint-disable eslint/no-console
import { env } from 'node:process'
import { simpleGit } from 'simple-git'
import { parse } from 'yaml'

/**
 * Load catalog from pnpm workspace file at specific git revision
 * @param revision Git revision to load file from (default: HEAD)
 * @param filePath Path to the pnpm workspace file (default: pnpm-workspace.yaml)
 * @returns Catalog object or empty object if not found
 */
export async function loadCatalogFromGit(
  revision = 'HEAD',
  filePath = 'pnpm-workspace.yaml',
): Promise<Record<string, string>> {
  try {
    // Handle case where revision might be undefined
    if (!revision) {
      return {}
    }

    const git = simpleGit()
    const content = await git.show([`${revision}:${filePath}`])
    const parsed = parse(content) as {
      catalog?: Record<string, string>
    } | null

    return parsed?.catalog ?? {}
  } catch {
    // Silently ignore errors in production code
    // Tests can check for specific error cases
    return {}
  }
}

/**
 * Find changed dependencies between two git revisions of pnpm workspace
 * @param oldRevision The previous git revision
 * @param newRevision The current git revision (default: HEAD)
 * @param filePath Path to the pnpm workspace file (default: pnpm-workspace.yaml)
 * @returns Array of package names that have changed
 */
export async function findChangedDependenciesFromGit(
  oldRevision: string,
  newRevision = 'HEAD',
  filePath = 'pnpm-workspace.yaml',
): Promise<Map<string, string>> {
  const oldCatalog = await loadCatalogFromGit(oldRevision, filePath)
  const newCatalog = await loadCatalogFromGit(newRevision, filePath)

  const bumps = new Map()

  const filtedPackage = Object.entries(newCatalog).filter(
    ([pkg, newVersion]) => oldCatalog[pkg] && oldCatalog[pkg] !== newVersion,
  )

  for (const [pkg, newVersion] of filtedPackage) {
    bumps.set(pkg, newVersion)
  }

  return bumps
}

export async function getBumpsFromGit(files: string[]): Promise<Map<string, string>> {
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

export async function handleChangesetFile(fileName: string) {
  if (!env['SKIP_COMMIT']) {
    await simpleGit().add(fileName)
    await simpleGit().commit(`chore: add ${fileName}`)
    await simpleGit().push()
  }
}
