export class PromiseType<T = unknown> extends Promise<T> {
  public cancel?: () => void
}

export type OnErrorFn = ((err: Error) => void | Promise<void>) | undefined
export type OnSuccessFn<T = unknown> =
  | ((result: T) => void | Promise<void>)
  | undefined
export type OnCancelFn = (() => void | Promise<void>) | undefined

/**
 * @typedef {Object} UseDataLoaderConfig
 * @property {Function} [onSuccess] callback when a request success
 * @property {Function} [onError] callback when a error is occured, this will override the onError specified on the Provider if any
 * @property {*} [initialData] initial data if no one is present in the cache before the request
 * @property {number} [pollingInterval] relaunch the request after the last success
 * @property {boolean} [enabled=true] launch request automatically (default true)
 * @property {boolean} [keepPreviousData=true] do we need to keep the previous data after reload (default true)
 */
export interface UseDataLoaderConfig<T = unknown> {
  enabled?: boolean
  initialData?: T
  keepPreviousData?: boolean
  onError?: OnErrorFn
  onSuccess?: OnSuccessFn
  pollingInterval?: number
}

/**
 * @typedef {Object} UseDataLoaderResult
 * @property {boolean} isIdle true if the hook in initial state
 * @property {boolean} isLoading true if the request is launched
 * @property {boolean} isSuccess true if the request success
 * @property {boolean} isError true if the request throw an error
 * @property {boolean} isPolling true if the request if enabled is true, pollingInterval is defined and the status is isLoading or isSuccess
 * @property {*} previousData if keepPreviousData is true it return the last data fetched
 * @property {*} data initialData if no data is fetched or not present in the cache otherwise return the data fetched
 * @property {string} error the error occured during the request
 * @property {Function} reload reload the data
 */
export interface UseDataLoaderResult<T = unknown> {
  data?: T
  error?: Error
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isPolling: boolean
  isSuccess: boolean
  previousData?: T
  reload: () => Promise<void>
}
