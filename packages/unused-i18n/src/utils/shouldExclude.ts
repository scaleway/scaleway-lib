import type { ShouldExcludeArgs } from '../types'

export const shouldExclude = ({
  excludeKey,
  line,
}: ShouldExcludeArgs): boolean => {
  if (!excludeKey) return false
  if (typeof excludeKey === 'string') {
    return line.includes(excludeKey)
  }

  return excludeKey.some(key => line.includes(key))
}
