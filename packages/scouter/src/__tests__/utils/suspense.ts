// Shared helpers for writing Suspense-related tests: manually controlled
// promises that a component can throw to suspend (and later resolve/reject).

export type Deferred<T = string> = {
  promise: Promise<T>
  value?: T
  error?: unknown
  resolve: (value: T) => void
  reject: (error: unknown) => void
}

export const createDeferred = <T>(): Deferred<T> => {
  // Assigned synchronously by the Promise executor below, before use.
  // oxlint-disable-next-line eslint/init-declarations
  let resolve!: (value: T) => void
  // oxlint-disable-next-line eslint/init-declarations
  let reject!: (error: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  const deferred: Deferred<T> = { promise, resolve, reject }

  promise.then(
    value => {
      deferred.value = value
    },
    (error: unknown) => {
      deferred.error = error
    },
  )

  return deferred
}

export type DeferredStatus = 'pending' | 'resolved' | 'rejected'

export const isResolved = <T>(deferred: Deferred<T>): DeferredStatus => {
  if (deferred.value !== undefined) {
    return 'resolved'
  }

  if (deferred.error !== undefined) {
    return 'rejected'
  }

  return 'pending'
}
