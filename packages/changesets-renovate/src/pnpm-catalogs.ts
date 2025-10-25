import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import * as yaml from 'js-yaml'
import glob from 'fast-glob'

const OLD_FILE = 'catalog-old.yaml'
const NEW_FILE = 'catalog.yaml' // your live catalog

function loadCatalog(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const parsed = yaml.load(content)
  return parsed.catalog || {}
}

// Step 1: Load catalogs
const oldCatalog = loadCatalog(OLD_FILE)
const newCatalog = loadCatalog(NEW_FILE)

// Step 2: Find changed deps
const changedDeps = Object.entries(newCatalog)
  .filter(
    ([pkg, newVersion]) => oldCatalog[pkg] && oldCatalog[pkg] !== newVersion,
  )
  .map(([pkg]) => pkg)

if (changedDeps.length === 0) {
  console.log('✅ No catalog dependency changes.')
  process.exit(0)
}

console.log('📦 Changed dependencies:', changedDeps)

// Step 3: Find affected packages
const packageJsonPaths = glob.sync('packages/*/package.json')
const affectedPackages = new Set()

for (const pkgJsonPath of packageJsonPaths) {
  const json = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
  const deps = {
    ...json.dependencies,
    ...json.devDependencies,
    ...json.peerDependencies,
  }

  for (const dep of changedDeps) {
    if (deps?.[dep]) {
      const dirName = path.basename(path.dirname(pkgJsonPath))
      affectedPackages.add(dirName)
    }
  }
}

if (affectedPackages.size === 0) {
  console.log('📦 No packages affected by catalog changes.')
  process.exit(0)
}

// Step 4: Generate changesets
for (const pkg of affectedPackages) {
  console.log(`✏  Creating changeset for ${pkg}...`)
  execSync(
    `npx changeset --empty --include=${pkg} --summary="Bump dependency from catalog update"`,
    {
      stdio: 'inherit',
    },
  )
}

console.log('✅ Done creating changesets.')
