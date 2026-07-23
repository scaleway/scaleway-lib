#!/usr/bin/env node
// oxlint-disable eslint/no-console
import { appendFileSync, realpathSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { createTags, exec, findWorkspaceRoot, listWorkspacePackages } from './utils.ts'
import type { WorkspacePackage } from './utils.ts'

const HELP = `Usage: release [options]

Bump and publish changed packages in the monorepo.

Detects which packages changed since the last "chore(release): publish" commit,
writes pnpm changeset files (all minor), then delegates to pnpm for version
bumping (including dependency propagation) and publishing.

Options:
  -r, --registry <url>   npm registry to publish to
      --dry-run          Report what would happen, no writes/publishes
      --skip-publish     Bump and tag, but don't publish to the registry
      --skip-push        Don't push the release commit and tags
  -h, --help             Show this help

Environment variables for registry auth:
  NPM_REGISTRY_USER      Registry username
  NPM_REGISTRY_PASSWD    Registry password
`

const RELEASE_SUBJECT = 'chore(release): publish'
const CHANGESET_MESSAGE = 'update generated APIs'

type CliOptions = {
  dryRun: boolean
  skipPublish: boolean
  skipPush: boolean
  registry?: string
}

const parseCliOptions = (): CliOptions | null => {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      registry: { type: 'string', short: 'r' },
      'dry-run': { type: 'boolean', default: false },
      'skip-publish': { type: 'boolean', default: false },
      'skip-push': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })

  if (values.help) {
    console.log(HELP)
    return null
  }

  return {
    dryRun: values['dry-run'] === true,
    skipPublish: values['skip-publish'] === true,
    skipPush: values['skip-push'] === true,
    registry: values.registry,
  }
}

const resolveAffectedPackages = (root: string): WorkspacePackage[] => {
  const packages = listWorkspacePackages(root)
  const lastSha =
    exec(`git log --grep="^${RELEASE_SUBJECT}" -1 --format="%H"`, {
      cwd: root,
    }) || null
  const range = lastSha ? `${lastSha}..HEAD` : 'HEAD~50..HEAD'
  const changedFiles = exec(`git diff --name-only ${range}`, { cwd: root }).split('\n').filter(Boolean)

  return packages.filter(pkg => !pkg.private && changedFiles.some(f => f.startsWith(`${pkg.relativePath}/`)))
}

const writeChangesetAndBump = (root: string, affected: WorkspacePackage[]) => {
  exec(`pnpm change --bump minor --summary "${CHANGESET_MESSAGE}" ${affected.map(({ name }) => name).join(' ')}`, {
    cwd: root,
  })

  // Bump versions — pnpm handles dependency propagation.
  // In recursive mode pnpm never creates git commits/tags itself, so the
  // working tree is left dirty for us to commit explicitly below — but only
  // after publish has succeeded, so a registry failure leaves the remote
  // untouched and the run can be retried from a pristine state.
  exec('pnpm version -r --no-git-checks --tag-version-prefix ""', {
    cwd: root,
    stdio: 'inherit',
  })
  exec('rm -rf .changeset/*', { cwd: root })
}

const publishPackages = (root: string, registry?: string) => {
  // Publish BEFORE committing/tagging/pushing. If publish fails (registry
  // down, auth expired, network, version already exists, ...) we abort and
  // leave the remote untouched — no tags pointing at unpublished versions.
  // `pnpm publish -r` skips versions already on the registry, so retries
  // are idempotent and only publish what's missing.
  const user = process.env['NPM_REGISTRY_USER']
  const passwd = process.env['NPM_REGISTRY_PASSWD']
  if (registry && user && passwd) {
    const host = registry.replace(/^https?:\/\//u, '')
    const auth = Buffer.from(`${user}:${passwd}`).toString('base64')
    const npmrcPath = join(root, '.npmrc')
    appendFileSync(npmrcPath, `\n//${host}/:_auth=${auth}\n`)
    console.log(`[release] authenticated to ${host}`)
  }
  const flag = registry ? ` --registry ${registry}` : ''
  exec(`pnpm publish -r --no-git-checks --access public${flag}`, {
    cwd: root,
    stdio: 'inherit',
  })
  console.log('[release] published')
}

const commitAndTag = (root: string, affected: WorkspacePackage[]) => {
  // Commit and tag — only reached if publish succeeded (or --skip-publish).
  exec('git add -A', { cwd: root })
  exec('git commit -m "chore(release): publish" --no-verify', { cwd: root })

  const updated = listWorkspacePackages(root)
  createTags({
    root,
    affectedPackages: affected,
    updatedPackages: updated,
  })
}

const pushRelease = (root: string, skipPush: boolean) => {
  if (skipPush) return
  exec('git push origin HEAD --tags --no-verify', { cwd: root })
  console.log('[release] pushed')
}

function main() {
  const options = parseCliOptions()
  if (!options) return

  const { dryRun, skipPublish, skipPush, registry } = options
  const root = findWorkspaceRoot(process.cwd())
  const affected = resolveAffectedPackages(root)

  console.log(`[release] ${affected.length} packages to bump (dryRun=${dryRun})`)
  for (const pkg of affected) console.log(`  - ${pkg.name}: ${pkg.version}`)

  if (dryRun || affected.length === 0) return

  writeChangesetAndBump(root, affected)

  if (!skipPublish) publishPackages(root, registry)

  commitAndTag(root, affected)
  pushRelease(root, skipPush)

  console.log('[release] done.')
}

// oxlint-disable-next-line unicorn/prefer-import-meta-properties -- tsconfig doesn't set a module option that supports import.meta.filename
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    main()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
