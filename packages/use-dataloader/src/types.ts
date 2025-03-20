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
   * True if the request is launched
   */
  isLoading: boolean
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
  ParamsType,
  ParamsKey extends keyof ParamsType,
> = Omit<UseDataLoaderConfig<ResultType, ErrorType>, 'initialData'> & {
  /**
   * Params will be forwarded to method
   */
  params: ParamsType
  /**
   * The key to change in params
   */
  pageKey: ParamsKey
  /**
   * If return undefined it consider that there are no remaining page to load
   */
  getNextPage: (result: ResultType) => ParamsType[ParamsKey]
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
  isLoadingFirstPage: boolean
  isSuccess: boolean
  hasNextPage: boolean
  reload: () => Promise<void>
  loadMore: () => void
}
