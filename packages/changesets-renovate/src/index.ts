#!/usr/bin/env node

import { exec, getExecOutput } from '@actions/exec'
import fs from 'node:fs/promises'

async function getPackagesNames(files: string[]): Promise<string[]> {
  const promises = files.map(async file => {
    const data = JSON.parse(await fs.readFile(file, 'utf8')) as {
      name: string
    }

    return data.name
  })

  return Promise.all(promises)
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
    const { stdout: changes } = await getExecOutput('git', ['show', file])

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

async function run() {
  const branch = await getExecOutput('git branch --show-current')

  if (!branch.stdout.startsWith('renovate/')) {
    console.log('Not a renovate branch, skipping')

    return
  }

  const diffOutput = await getExecOutput('git diff --name-only HEAD~1')
  const diffFiles = diffOutput.stdout.split('\n')

  if (diffFiles.find(f => f.startsWith('.changeset'))) {
    console.log('Changeset already exists, skipping')

    return
  }

  const files = diffFiles.filter(file => file.includes('package.json'))
  const packageNames = await getPackagesNames(files)

  if (!packageNames.length) {
    console.log('No package.json changes to published packages, skipping')

    return
  }

  const { stdout: shortHash } = await getExecOutput(
    'git rev-parse --short HEAD',
  )
  const fileName = `.changeset/renovate-${shortHash.trim()}.md`
  const packageBumps = await getBumps(files)
  await createChangeset(fileName, packageBumps, packageNames)
  await exec('git', ['add', fileName])
  await exec('git commit -C HEAD --amend --no-edit')
  await exec('git push --force')
}

run().catch(console.error)
