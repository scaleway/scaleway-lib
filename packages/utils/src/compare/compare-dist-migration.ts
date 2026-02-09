#!/usr/bin/env node

// oxlint-disable eslint/no-console
// oxlint-disable eslint/max-statements
// biome-ignore-all lint/style/noNonNullAssertion: error

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import {
  BASELINE_FILE,
  CURRENT_FILE,
  OUTPUT_DIR,
  REPORT_FILE,
} from './config.ts'
import { compareManifests } from './helpers/compareManifests.ts'
import { generateManifest } from './helpers/generateManifest.ts'

function main(): void {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log('Starting dist comparison for Vite v6 → v8 migration...')

  // Generate current manifest
  generateManifest(CURRENT_FILE)

  // Check if baseline exists
  if (!existsSync(BASELINE_FILE)) {
    console.log(
      'No baseline manifest found. Creating one for future comparison.',
    )
    console.log('To compare with a previous version:')
    console.log('1. Run this script before migration to create baseline')
    console.log('2. Run migration')
    console.log('3. Run this script again to compare')
    copyFileSync(CURRENT_FILE, BASELINE_FILE)

    return
  }

  // Compare manifests
  compareManifests(BASELINE_FILE, CURRENT_FILE, REPORT_FILE)

  // Display summary
  console.log('\nSummary:')
  const reportContent = readFileSync(REPORT_FILE, 'utf8')
  const lines = reportContent.split('\n')
  console.log(lines.slice(-20).join('\n'))
}

main()
