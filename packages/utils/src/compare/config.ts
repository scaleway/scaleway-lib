import path from 'node:path'

// Configuration
export const MONOREPO_ROOT = path.resolve(import.meta.dirname, '../../../')
export const PACKAGES_DIR = path.join(MONOREPO_ROOT, '')
export const OUTPUT_DIR = path.join(MONOREPO_ROOT, '../.dist-compare')
export const BASELINE_FILE = path.join(OUTPUT_DIR, 'baseline-manifest.json')
export const CURRENT_FILE = path.join(OUTPUT_DIR, 'current-manifest.json')
export const REPORT_FILE = path.join(OUTPUT_DIR, 'migration-compare-report.txt')

// Colors for output
export const COLORS = {
  GREEN: '\u001B[0;32m',
  NC: '\u001B[0m', // No Color
  RED: '\u001B[0;31m',
  YELLOW: '\u001B[1;33m',
}
