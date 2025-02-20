import type { GetMissingTranslationsArgs } from '../types'
import { escapeRegex } from './escapeRegex'
import { shouldExclude } from './shouldExclude'

export const getMissingTranslations = ({
  localLines,
  excludeKey,
  extractedTranslations,
}: GetMissingTranslationsArgs): string[] => localLines.filter(line => {
    if (shouldExclude({ line, excludeKey })) {
      return false
    }

    if (extractedTranslations.includes(line)) {
      return false
    }

    return !extractedTranslations.some(item => {
      if (item === '**') {
        return /^\w+$/.test(line)
      }
      const pattern = new RegExp(
        `^${escapeRegex(item).replace(/\\\*\\\*/g, '.*?')}$`,
      )

      return pattern.test(line)
    })
  })
