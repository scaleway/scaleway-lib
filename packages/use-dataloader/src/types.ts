type PrimitiveType = string | number | boolean | null | undefined | Date
export type KeyType = string | number | PrimitiveType[]

export class PromiseType<T = unknown> extends Promise<T> {
  cancel?: () => void
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

export type UseDataLoaderConfig<ResultType, ErrorType> = {
  /**
   * Launch request automatically on mount
   * @default true
   */
  enabled?: boolean
  /**
   * The initial data if no one is present in the cache before the request
   */
  initialData?: ResultType
  /**
   * Do we need to keep the previous data after reload (default true)
   * @default true
   */
  keepPreviousData?: boolean
  /*
   * Callback when a error is occured, this will override the onError specified on the Provider if any
   */
  onError?: OnErrorFn<ErrorType>
  /**
   * Callback when a request success
   */
  onSuccess?: OnSuccessFn<ResultType>
  /**
   * If you want to relaunch the request after the last success
   */
  pollingInterval?: number
  /**
   * Time before data from previous success is considered as outdated (in millisecond)
   * @default undefined
   */
  dataLifetime?: number
  /**
   * When pollingInterval is set you can set a set a custom callback to know if polling is enabled
   * @default true
   */
  needPolling?: NeedPollingType<ResultType>
}

export type UseDataLoaderResult<ResultType, ErrorType> = {
  /**
   * Return initialData if no data is fetched or not present in the cache otherwise return the data fetched
   */
  data?: ResultType
  /**
   * The error occured during the request
   */
  error?: ErrorType
  /**
   * True if the request throw an error
   */
  isError: boolean
  /**
   * True if the hook in initial state
   */
  isIdle: boolean
  /**
   * True only when there is no cache data and we're fetching data for the first time
   */
  isLoading: boolean
  /**
   * True if there is an active request in progress
   */
  isFetching: boolean
  /**
   * True if the request if enabled is true, pollingInterval is defined and the status is isLoading or isSuccess
   */
  isPolling: boolean
  /**
   * True if the request success
   */
  isSuccess: boolean
  /**
   * If keepPreviousData is true it return the last data fetched
   */
  previousData?: ResultType
  /**
   * Reload the data
   */
  reload: () => Promise<void>
}

export type UseInfiniteDataLoaderConfig<
  ResultType,
  ErrorType extends Error,
  ParamsType extends Record<string, unknown>,
  ParamsKey extends keyof ParamsType,
> = Omit<UseDataLoaderConfig<ResultType, ErrorType>, 'initialData'> & {
  /**
   * If return undefined it consider that there are no remaining page to load
   */
  getNextPage: (
    lastRes: ResultType,
    lastParams: ParamsType,
  ) => ParamsType[ParamsKey]
  /**
   * The initial data if no one is present in the cache before the request
   */
  initialData?: ResultType[]
}

export type UseInfiniteDataLoaderResult<ResultType, ErrorType> = {
  data?: ResultType[]
  error?: ErrorType
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  hasNextPage: boolean
  isLoadingFirstPage: boolean
  reload: () => Promise<void>
  loadMore: () => void
}

export type UseDataLoaderReloadResult = {
  reload: (key: KeyType) => Promise<void>
  reloadAll: () => Promise<void>
  reloadAllActive: () => Promise<void>
  reloadGroup: (startKey: KeyType) => Promise<void>
  reloadGroupActive: (startKey: KeyType) => Promise<void>
}
