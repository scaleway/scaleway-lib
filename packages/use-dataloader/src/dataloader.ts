import { DEFAULT_MAX_CONCURRENT_REQUESTS, StatusEnum } from './constants'
import { isAbortError } from './helpers'
import type { DataLoaderMethodFn, PromiseType, RefetchPolicy, RequestHandlers } from './types'

export type DataLoaderConstructorArgs<ResultType> = {
  key: string
  method: DataLoaderMethodFn<ResultType>
  enabled?: boolean
  notifyChanges?: () => void
}

class DataLoader<ResultType, ErrorType> {
  public static maxConcurrent: number = DEFAULT_MAX_CONCURRENT_REQUESTS

  public static started = 0

  public static cachedData: Record<string, unknown> = {}

  public static queue = new Map<string, PromiseType>()

  public key: string

  public method: DataLoaderMethodFn<ResultType>

  public isCalled = false

  public isCancelled = true

  public status: StatusEnum = StatusEnum.IDLE

  public error?: ErrorType

  public data?: ResultType

  public observers: (() => void)[] = []

  /**
   * Refetch preferences of the mounted hooks observing this request, used by
   * the DataLoaderProvider focus/reconnect listeners to decide whether the
   * request must be refetched on window focus or network reconnection.
   */
  public refetchPolicies = new Set<RefetchPolicy>()

  /**
   * Handlers of mounted hooks, fired whenever the request settles. Each
   * observing hook registers its own handlers; all fire on every settle
   * (mount load, reload, polling, focus/reconnect refetch, provider reload).
   * Handler errors are swallowed (documented behavior).
   */
  public handlers = new Set<RequestHandlers<ResultType, ErrorType>>()

  public timeout?: number

  public loadCount = 0

  /**
   * Monotonically increasing token of the current launch. Bumped on every
   * launch() and on cancel(): a cancelled or superseded launch keeps its own
   * token and becomes inert when it settles, so it can no longer clobber the
   * data/status/cache of the launch that replaced it (React StrictMode
   * remounts, key changes, forced reloads while a request is in flight).
   */
  public generation = 0

  public isFirstLoading = true

  public dataUpdatedAt?: number

  private abortController?: AbortController

  public constructor(args: DataLoaderConstructorArgs<ResultType>) {
    this.key = args.key
    this.method = args.method
    if (args.enabled === true) {
      this.status = StatusEnum.LOADING
    }
    this.data = DataLoader.cachedData[this.key] as ResultType
    if (args.notifyChanges) {
      this.observers.push(args.notifyChanges)
    }
  }

  public notifyChanges(): void {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      for (const observer of this.observers) {
        observer()
      }
    }, 0)
  }

  public getData(): ResultType | undefined {
    return DataLoader.cachedData[this.key] as ResultType
  }

  private readonly tryLaunch = async (): Promise<ResultType> => {
    if (DataLoader.started < DataLoader.maxConcurrent) {
      DataLoader.started += 1
      DataLoader.queue.set(this.key, this.launch())
    } else {
      DataLoader.queue.set(
        this.key,
        new Promise(resolve => {
          setTimeout(resolve, 0)
        }).then(this.tryLaunch),
      )
    }

    return DataLoader.queue.get(this.key) as Promise<ResultType>
  }

  public load = async (force = false): Promise<ResultType> => {
    if (force || !this.isCalled) {
      this.isCalled = true

      if (this.status !== StatusEnum.LOADING) {
        this.status = StatusEnum.LOADING
        this.notifyChanges()
      }

      DataLoader.queue.set(this.key, this.tryLaunch())
    }

    return DataLoader.queue.get(this.key) as Promise<ResultType>
  }

  public launch = async (): Promise<ResultType | undefined> => {
    const generation = ++this.generation
    try {
      this.abortController = new AbortController()
      this.isCancelled = false
      this.loadCount += 1

      const data = await this.method({ signal: this.abortController.signal })

      // Only the launch that is still the current one (not aborted by cancel()
      // and not superseded by a newer launch) may touch shared state. A stale
      // launch must stay read-only: writing would overwrite newer data.
      if (generation === this.generation) {
        DataLoader.cachedData[this.key] = data
        this.status = StatusEnum.SUCCESS
        this.data = data
        this.error = undefined
        this.dataUpdatedAt = Date.now()
        this.isCalled = false
        this.isFirstLoading = false
        DataLoader.queue.delete(this.key)
        this.notifyChanges()
      }
      // Decrement started BEFORE firing handlers: a handler that triggers
      // another load would deadlock at maxConcurrent otherwise.
      DataLoader.started -= 1

      // Fire onSuccess handlers for the live launch. Handler errors are
      // swallowed (documented behavior) — they don't affect request state.
      // Fire in parallel to avoid sequential delays.
      if (generation === this.generation) {
        await Promise.all(
          [...this.handlers].map(async ({ onSuccess }) => {
            try {
              await onSuccess(data)
            } catch {
              // swallow
            }
          }),
        )
      }

      return data
    } catch (error) {
      const isLive = generation === this.generation
      if (isLive && !isAbortError(error)) {
        this.status = StatusEnum.ERROR
        this.error = error as ErrorType
      }
      if (isLive) {
        this.isCalled = false
        this.isFirstLoading = false
        DataLoader.queue.delete(this.key)
        this.notifyChanges()
      }
      // Decrement started BEFORE firing handlers (same reason as success path).
      DataLoader.started -= 1

      // Fire onError handlers for the live launch. Handler errors are swallowed.
      // Fire in parallel to avoid sequential delays.
      if (isLive && !isAbortError(error)) {
        await Promise.all(
          [...this.handlers].map(async ({ onError }) => {
            try {
              await onError(error as ErrorType)
            } catch {
              // swallow
            }
          }),
        )
        throw error
      }

      return undefined
    }
  }

  public clearData(): void {
    DataLoader.cachedData[this.key] = undefined
  }

  public cancel(): void {
    if (this.abortController) {
      this.abortController.abort('usedataloader: cancel request')
    }
    // Invalidate any in-flight launch so its late settle cannot write state
    this.generation += 1
    // Do not decrement DataLoader.started here — launch() handles it in its
    // try/catch when the aborted method settles. Decrementing in both places
    // would double-count and corrupt the concurrency counter.
    DataLoader.queue.delete(this.key)
    this.isCancelled = true
    // Reset isCalled so a subsequent load() (e.g. after a React StrictMode
    // remount or a key change) actually re-launches instead of being a no-op.
    this.isCalled = false
    this.status = StatusEnum.IDLE
  }

  public addObserver(observer: () => void): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: () => void): void {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }
}

export default DataLoader
