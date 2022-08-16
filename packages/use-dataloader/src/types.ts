type PrimitiveType = string | number | boolean | null | undefined | Date
export type KeyType = string | number | PrimitiveType[]

export class PromiseType<T = unknown> extends Promise<T> {
  public cancel?: () => void
}

export type OnErrorFn<ErrorType = Error> =
  | ((err: ErrorType) => void | Promise<void>)
  | undefined
export type OnSuccessFn<ResultType> =
  | ((result: ResultType) => void | Promise<void>)
  | undefined
export type OnCancelFn = (() => void | Promise<void>) | undefined
export type NeedPollingType<ResultType> =
  | boolean
  | ((data?: ResultType) => boolean)

/**
 * @typedef {Object} UseDataLoaderConfig
 * @property {Function} [onSuccess] callback when a request success
 * @property {Function} [onError] callback when a error is occured, this will override the onError specified on the Provider if any
 * @property {*} [initialData] initial data if no one is present in the cache before the request
 * @property {number} [pollingInterval] relaunch the request after the last success
 * @property {boolean} [enabled=true] launch request automatically (default true)
 * @property {boolean} [keepPreviousData=true] do we need to keep the previous data after reload (default true)
 * @property {number} [dataLifetime=undefined]  Time before data from previous success is considered as outdated (in millisecond)
 * @property {NeedPollingType} [needPolling=true] When pollingInterval is set you can set a set a custom callback to know if polling is enabled
 */
export interface UseDataLoaderConfig<ResultType, ErrorType> {
  enabled?: boolean
  initialData?: ResultType
  keepPreviousData?: boolean
  onError?: OnErrorFn<ErrorType>
  onSuccess?: OnSuccessFn<ResultType>
  pollingInterval?: number
  dataLifetime?: number
  needPolling?: NeedPollingType<ResultType>
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
export interface UseDataLoaderResult<ResultType, ErrorType> {
  data?: ResultType
  error?: ErrorType
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isPolling: boolean
  isSuccess: boolean
  previousData?: ResultType
  reload: () => Promise<void>
}

/**
 * Params send to the method
 */
export type UsePaginatedDataLoaderMethodParams = {
  page: number
  perPage: number
}

export type UsePaginatedDataLoaderConfig<ResultType, ErrorType> =
  UseDataLoaderConfig<ResultType, ErrorType> & {
    initialPage?: number
    perPage?: number
  }

export type UsePaginatedDataLoaderResult<ResultType, ErrorType> = {
  pageData?: ResultType
  data?: Record<number, ResultType | undefined>
  error?: ErrorType
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isPolling: boolean
  isSuccess: boolean
  reload: () => Promise<void>
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  page: number
}
