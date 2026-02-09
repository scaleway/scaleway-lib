import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PACKAGES_DIR } from '../config.ts'
import type { Manifest, PackageInfo } from '../types.ts'
import { getAllFiles } from './getAllFiles.ts'

const { log: logger } = console

export const generateManifest = (outputFile: string) => {
  const packages = readdirSync(PACKAGES_DIR).filter(item =>
    statSync(join(PACKAGES_DIR, item)).isDirectory(),
  )
  logger(`Generating manifest for ${packages.length} packages...`)

  const manifest: Manifest = {
    packages: {} as Record<string, PackageInfo>,
    timestamp: new Date().toISOString(),
    vite_version: '8.0.0-beta.2',
  }

  for (const pkg of packages) {
    const packageDist = join(PACKAGES_DIR, pkg, 'dist')
    if (existsSync(packageDist)) {
      logger(`  Processing ${pkg}...`)
      const files = getAllFiles(packageDist, packageDist)

      manifest.packages[pkg] = {
        files,
        total_files: files.length,
        total_size: files.reduce((sum, f) => sum + f.size, 0),
      }
    } else {
      logger(`  Warning: No dist folder for ${pkg}`)
    }
  }

  writeFileSync(outputFile, JSON.stringify(manifest, null, 2))
}
