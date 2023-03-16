#!/usr/bin/env node

import fs from 'node:fs/promises'
import { simpleGit } from 'simple-git'

async function getPackagesNames(files: string[]): Promise<string[]> {
  const packages: string[] = []

  const promises = files.map(async file => {
    const data = JSON.parse(await fs.readFile(file, 'utf8')) as {
      name: string
      workspaces?: string[]
    }

    if (!data.workspaces) {
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
) {
  let message = ''

  for (const [pkg, bump] of packageBumps) {
    message += `Updated dependency \`${pkg}\` to \`${bump}\`.\n`
  }

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

export async function run() {
  const branch = await simpleGit().branch()

  console.log('Detected branch:', branch)

  if (!branch.current.startsWith('renovate/')) {
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
  await simpleGit().add(fileName)
  await simpleGit().commit(`Add changeset renovate-${shortHash}`)
  await simpleGit().push()
}

run().catch(console.error)
