import type { KeyType } from './types'

export const isAbortError = (error: unknown) => error instanceof Error && error.name === 'AbortError'

/**
 * Wrap success/error handlers so they only run if no newer load has been
 * initiated since (the load token is monotonic). Guards against a superseded
 * launch — e.g. one cancelled by a React StrictMode remount — firing user
 * callbacks or resetting state once a newer load has started.
 */
export const createTokenGuardedHandlers = <OnSuccessArgs extends unknown[], OnErrorArgs extends unknown[]>(
  tokenRef: { current: number },
  onSuccess: (...args: OnSuccessArgs) => unknown,
  onError: (...args: OnErrorArgs) => unknown,
) => {
  const loadToken = ++tokenRef.current

  return {
    onSuccessCallback: async (...args: OnSuccessArgs): Promise<void> => {
      if (loadToken === tokenRef.current) {
        await onSuccess(...args)
      }
    },
    onErrorCallback: async (...args: OnErrorArgs): Promise<void> => {
      if (loadToken === tokenRef.current) {
        await onError(...args)
      }
    },
  }
}

/**
 *
 * @param {KeyType} queryKey
 * @returns string
 */
export const marshalQueryKey = (queryKey: KeyType): string =>
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
