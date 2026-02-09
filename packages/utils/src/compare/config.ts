import { join, resolve } from 'node:path'

// Configuration
export const MONOREPO_ROOT = resolve(import.meta.dirname, '../../../')
export const PACKAGES_DIR = join(MONOREPO_ROOT, '')
export const OUTPUT_DIR = join(MONOREPO_ROOT, '../.dist-compare')
export const BASELINE_FILE = join(OUTPUT_DIR, 'baseline-manifest.json')
export const CURRENT_FILE = join(OUTPUT_DIR, 'current-manifest.json')
export const REPORT_FILE = join(OUTPUT_DIR, 'migration-compare-report.txt')

// Colors for output
export const COLORS = {
  GREEN: '\u001B[0;32m',
  NC: '\u001B[0m', // No Color
  RED: '\u001B[0;31m',
  YELLOW: '\u001B[1;33m',
}
