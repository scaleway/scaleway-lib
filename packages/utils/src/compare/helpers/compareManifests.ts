// oxlint-disable eslint/max-statements, eslint/complexity
// oxlint-disable typescript/no-unsafe-assignment, typescript-eslint/no-unsafe-call
import { readFileSync, writeFileSync } from 'node:fs'
import { COLORS } from '../config.ts'
import type { Manifest } from '../types.ts'

const { log: logger, error: logError } = console

export const compareManifests = (
  baselinePath: string,
  currentPath: string,
  reportPath: string,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ok here
) => {
  logger('Comparing manifests...')
  // oxlint-disable-next-line typescript/no-unsafe-assignment
  const baseline: Manifest = JSON.parse(readFileSync(baselinePath, 'utf8'))
  // oxlint-disable-next-line typescript/no-unsafe-assignment
  const current: Manifest = JSON.parse(readFileSync(currentPath, 'utf8'))

  let report = 'Migration Comparison Report\n'
  report += `Generated: ${new Date().toISOString()}\n`
  report += '=================================\n'

  const baselinePackages = Object.keys(baseline.packages).toSorted()
  const currentPackages = Object.keys(current.packages).toSorted()

  const newPackages = currentPackages.filter(p => !baselinePackages.includes(p))
  const missingPackages = baselinePackages.filter(
    p => !currentPackages.includes(p),
  )

  if (newPackages.length > 0) {
    report += `\n${COLORS.GREEN}New packages:${COLORS.NC}\n`
    report += `${newPackages.join('\n')}\n`
  }

  if (missingPackages.length > 0) {
    report += `\n${COLORS.RED}Missing packages:${COLORS.NC}\n`
    report += `${missingPackages.join('\n')}\n`
  }

  const commonPackages = baselinePackages.filter(p =>
    currentPackages.includes(p),
  )

  for (const pkg of commonPackages) {
    logError(`Comparing ${pkg}...`)

    const baselineFiles = baseline.packages[pkg]?.files
      .map(f => f.path)
      .toSorted()
    const currentFiles = current.packages[pkg]?.files
      .map(f => f.path)
      .toSorted()

    const newFiles = currentFiles?.filter(f => !baselineFiles?.includes(f))
    const missingFiles = baselineFiles?.filter(f => !currentFiles?.includes(f))
    const commonFiles = baselineFiles?.filter(f => currentFiles?.includes(f))

    let hasChanges = false

    if ((newFiles?.length ?? 0) > 0 || (missingFiles?.length ?? 0) > 0) {
      hasChanges = true
      report += `\n${COLORS.YELLOW}Package: ${pkg}${COLORS.NC}\n`

      if (newFiles && newFiles.length > 0) {
        report += '  New files:\n'
        report += `${newFiles?.map(f => `    ${f}`).join('\n')}\n`
      }

      if (missingFiles && missingFiles.length > 0) {
        report += '  Missing files:\n'
        report += `${missingFiles.map(f => `    ${f}`).join('\n')}\n`
      }
    }

    const modifiedFiles: string[] = []
    if (commonFiles) {
      for (const file of commonFiles) {
        const baselineFile = baseline.packages[pkg]?.files.find(
          ({ path }) => path === file,
        )

        const currentFile = current.packages[pkg]?.files.find(
          ({ path }) => path === file,
        )
        if (baselineFile?.checksum !== currentFile?.checksum) {
          modifiedFiles.push(
            `${file} (${baselineFile?.size} → ${currentFile?.size} bytes)`,
          )
        }
      }
    }

    if (modifiedFiles.length > 0) {
      hasChanges = true
      if (!report.includes(`Package: ${pkg}`)) {
        report += `\n${COLORS.YELLOW}Package: ${pkg}${COLORS.NC}\n`
      }
      report += '  Modified files:\n'
      report += `${modifiedFiles.map(f => `    ${f}`).join('\n')}\n`
    }

    if (!hasChanges) {
      logError(`✓ ${pkg}: No changes`)
    }
  }

  writeFileSync(reportPath, report)
  logger(`\nComparison complete. Report saved to: ${reportPath}`)
}
