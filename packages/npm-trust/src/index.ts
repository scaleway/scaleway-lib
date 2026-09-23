#!/usr/bin/env node

import { realpathSync } from 'node:fs'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import { exec, findWorkspaceRoot, hasExistingTrust, isPackagePublished, listPublicWorkspacePackages } from './utils'

type Package = {
  name: string
  path: string
  version?: string
  private?: boolean
}

type Options = {
  dryRun: boolean
  check: boolean
  workflowFile: string
  repo?: string
  yes: boolean
}

const HELP = `Usage: npm-trust [options]

Configure npm trusted publishers (GitHub Actions) for all non-private
workspace packages. Detects unpublished packages and offers to publish
them first. Skips packages that already have a trust relationship.

Options:
  -f, --file <workflow>   GitHub Actions workflow file (default: deploy-package.yml)
  -r, --repo <owner/name> GitHub repository
      --dry-run           Report what would happen, no changes
      --check             Only check for unpublished packages; exit 1 if any found
  -y, --yes               Skip prompts, answer yes to everything
  -h, --help              Show this help

Note: requires "npm login" first (npm trust list needs auth to check
existing trusts). If the check fails, the package is tried anyway and
npm itself will report conflicts (E409).
`

function parseArgs_(): Options | null {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      file: { type: 'string', short: 'f', default: 'deploy-package.yml' },
      repo: { type: 'string', short: 'r' },
      'dry-run': { type: 'boolean', default: false },
      check: { type: 'boolean', default: false },
      yes: { type: 'boolean', short: 'y', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })
  if (values.help) {
    console.log(HELP)
    return null
  }
  return {
    dryRun: values['dry-run'],
    check: values.check,
    workflowFile: values.file,
    repo: values.repo,
    yes: values.yes,
  }
}

async function promptYesNo(question: string, defaultValue = false): Promise<boolean> {
  const rl = createInterface({ input, output })
  try {
    const raw = await rl.question(`${question} (y/N) `)
    const answer = raw.trim().toLowerCase()
    return answer === 'y' || answer === 'yes'
  } catch {
    return defaultValue
  } finally {
    rl.close()
  }
}

function findUnpublishedPackages(packages: Package[]): Package[] {
  const unpublished: Package[] = []
  for (const pkg of packages) {
    if (!isPackagePublished(pkg.name)) {
      unpublished.push(pkg)
    }
  }
  return unpublished
}

async function publishUnpublished(packages: Package[], options: Options): Promise<void> {
  if (packages.length === 0) {
    return
  }
  console.log(`\n[trust] ${packages.length} unpublished package(s) detected:`)
  for (const pkg of packages) {
    console.log(`  - ${pkg.name} (v${pkg.version})`)
  }

  if (options.dryRun) {
    console.log('[dry-run] would prompt to publish these packages first')
    return
  }

  const shouldPublish = options.yes || (await promptYesNo('\nPublish these packages first?'))
  if (!shouldPublish) {
    console.log('[trust] skipping publish, proceeding to trust setup')
    return
  }

  for (const pkg of packages) {
    const cmd = `npm publish --access public --force`
    console.log(`>>> ${cmd} (in ${pkg.path})`)
    try {
      exec(cmd, { cwd: pkg.path, stdio: 'inherit' })
      console.log(`published: ${pkg.name}`)
    } catch {
      console.error(`WARN: publish failed for ${pkg.name}`)
    }
  }
}

function configureTrust(packages: Package[], options: Options) {
  let applied = 0
  let skipped = 0
  let failed = 0

  for (const pkg of packages) {
    const cmd = `npm trust github ${pkg.name} --file ${options.workflowFile} --repo ${options.repo} -y --allow-publish --force`

    if (options.dryRun) {
      console.log(`[dry-run] ${cmd}`)
      applied++
    } else if (hasExistingTrust(pkg.name)) {
      console.log(`SKIP: ${pkg.name} — trust already configured`)
      skipped++
    } else {
      console.log(`>>> ${cmd}`)
      try {
        exec(cmd, { stdio: 'inherit' })
        applied++
      } catch {
        console.error(`WARN: failed for ${pkg.name}`)
        failed++
      }
    }
  }

  console.log(`[trust] done: ${applied} applied, ${skipped} skipped, ${failed} failed`)
}

async function main(): Promise<void> {
  const options = parseArgs_()
  if (!options) {
    return
  }

  if (!options.repo) {
    console.error('missing --repo')
    process.exit(1)
  }

  const root = findWorkspaceRoot(process.cwd())
  const packages = listPublicWorkspacePackages(root)
  console.log(`[trust] ${packages.length} non-private packages`)

  if (options.check) {
    const unpublished = findUnpublishedPackages(packages)
    if (unpublished.length === 0) {
      console.log('[check] all packages are published on npm')
      process.exit(0)
    }
    console.log(`[check] ${unpublished.length} unpublished package(s) found:`)
    for (const pkg of unpublished) {
      console.log(`  - ${pkg.name} (v${pkg.version})`)
    }
    console.log('[check] publish and configure trust before merging')
    process.exit(1)
  }

  if (!options.dryRun) {
    const unpublished = findUnpublishedPackages(packages)
    await publishUnpublished(unpublished, options)
  }

  configureTrust(packages, options)
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(import.meta.filename)) {
  try {
    await main()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
