import type { KeyType } from './types'

/**
 *
 * @param {KeyType} queryKey
 * @returns string
 */
const marshalQueryKey = (queryKey: KeyType): string =>
  Array.isArray(queryKey)
    ? queryKey
        // For now, we treat null values as if they were undefined
        // because we can't stringified them and JSON.stringify is not performant
        .filter(value => value !== undefined && value !== null)
        .map(subKey => {
          if (subKey instanceof Date) {
            return subKey.toISOString()
          }

          return subKey.toString()
        })
        .join('.')
    : queryKey.toString()

export { marshalQueryKey }
