import * as fs from 'fs'
import { performance } from 'perf_hooks'
import { analyze } from './lib/analyze'
import { removeLocaleKeys } from './lib/remove'
import { searchFilesRecursively } from './lib/search'
import type { ProcessTranslationsArgs } from './types'
import { loadConfig } from './utils/loadConfig'
import { getMissingTranslations } from './utils/missingTranslations'
import { summary } from './utils/summary'

export const processTranslations = async ({
  paths,
  action,
}: ProcessTranslationsArgs) => {
  const config = await loadConfig()
  const excludePatterns = [/\.test\./, /__mock__/]
  const localesExtensions = config.localesExtensions ?? 'js'
  const localesNames = config.localesNames ?? 'en'

  let totalUnusedLocales = 0
  const unusedLocalesCountByPath: {
    path: string
    messages?: string
    warning?: string
  }[] = []

  const pathsToProcess = paths || config.paths

  const startTime = performance.now()
  pathsToProcess.forEach(({ srcPath, localPath }) => {
    let allExtractedTranslations: string[] = []
    let pathUnusedLocalesCount = 0

    srcPath.forEach(pathEntry => {
      const ignorePathExists = config.ignorePaths?.some(ignorePath =>
        pathEntry.includes(ignorePath),
      )
      if (ignorePathExists) return
      const files = searchFilesRecursively({
        excludePatterns,
        regex: /use-i18n/,
        baseDir: pathEntry,
      })

      const extractedTranslations = files
        .flatMap(file =>
          analyze({
            filePath: file,
            scopedNames: config.scopedNames,
          }),
        )
        .sort()
        .filter((item, index, array) => array.indexOf(item) === index)

      allExtractedTranslations = [
        ...allExtractedTranslations,
        ...extractedTranslations,
      ]
    })

    allExtractedTranslations = [...new Set(allExtractedTranslations)].sort()

    const localeFilePath = `${localPath}/${localesNames}.${localesExtensions}`
    const ignorePathExists = config.ignorePaths?.some(ignorePath =>
      localeFilePath.includes(ignorePath),
    )
    if (fs.existsSync(localeFilePath) && !ignorePathExists) {
      console.log(`${localeFilePath}...`)

      const localLines = fs
        .readFileSync(localeFilePath, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => !line.startsWith('//') && line.match(/'[^']*':/))
        .map(line => line.match(/'([^']+)':/)?.[1] ?? '')
        .sort()

      const missingTranslations = getMissingTranslations({
        localLines,
        extractedTranslations: allExtractedTranslations,
        excludeKey: config.excludeKey,
      })

      pathUnusedLocalesCount = missingTranslations.length
      totalUnusedLocales += pathUnusedLocalesCount

      const formattedMissingTranslations = missingTranslations
        .map(translation => `\x1b[31m${translation}\x1b[0m`)
        .join('\n')

      const message = missingTranslations.length
        ? `Unused translations in \x1b[33m${localeFilePath}\x1b[0m : \x1b[31m${pathUnusedLocalesCount}   \n${formattedMissingTranslations}\x1b[0m`
        : undefined

      if (message) {
        unusedLocalesCountByPath.push({
          path: localPath,
          messages: message,
        })
      }
      if (action === 'remove') {
        removeLocaleKeys({
          localePath: localeFilePath,
          missingTranslations,
        })
      }
    }
  })
  const endTime = performance.now()

  summary({ unusedLocalesCountByPath, totalUnusedLocales })
  console.log(
    `\x1b[38;2;128;128;128mDuration   : ${(endTime - startTime).toFixed(
      0,
    )}ms\x1b[0m`,
  )

  if (totalUnusedLocales > 0) {
    process.exit(1)
  }
}
