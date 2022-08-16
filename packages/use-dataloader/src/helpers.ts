import type { KeyType } from './types'

/**
 *
 * @param {KeyType} queryKey
 * @returns string
 */
export const marshalQueryKey = (queryKey: KeyType) =>
  Array.isArray(queryKey)
    ? queryKey
        .filter(Boolean)
        .map(subKey => {
          if (subKey instanceof Date) {
            return subKey.toISOString()
          }

          return subKey?.toString()
        })
        .join('.')
    : queryKey?.toString()
