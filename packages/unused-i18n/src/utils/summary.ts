import type { SummaryArgs } from '../types'

export const summary = ({
  unusedLocalesCountByPath,
  totalUnusedLocales,
}: SummaryArgs) => {
  for (const { messages, warning } of unusedLocalesCountByPath) {
    console.log(messages ?? '')
    if (warning) {
      console.log(warning)
    }
  }

  console.log(`Total unused locales: \x1b[33m${totalUnusedLocales}\x1b[0m`)
}
