import type { Context } from 'react'
import { createContext, useContext } from 'react'
import type DataLoader from './dataloader'
import type { DataLoaderMethodFn, KeyType } from './types'

type PromiseVoidFunc = (() => Promise<unknown>) | (() => void)

export type CachedData = Record<string, unknown>

export type Reloads = Record<string, PromiseVoidFunc>

export type UseDataLoaderInitializerArgs<ResultType = unknown> = {
  method: DataLoaderMethodFn<ResultType>
  enabled?: boolean
}

type GetCachedDataFn = {
  (): CachedData
  (key?: KeyType): unknown
}

type GetReloadsFn = {
  (): Reloads
  (key?: KeyType): PromiseVoidFunc | undefined
}

export type IDataLoaderContext = {
  addRequest: <ResultType, ErrorType>(
    key: KeyType,
    args: UseDataLoaderInitializerArgs<ResultType>,
  ) => DataLoader<ResultType, ErrorType>
  getOrAddRequest: <ResultType, ErrorType>(
    key: KeyType,
    args: UseDataLoaderInitializerArgs<ResultType>,
  ) => DataLoader<ResultType, ErrorType>
  computeKey: (key: KeyType) => string
  cacheKeyPrefix?: string
  defaultDatalifetime?: number
  onError?: (error: Error) => void | Promise<void>
  clearAllCachedData: () => void
  clearCachedData: (key: KeyType) => void
  getCachedData: GetCachedDataFn
  getReloads: GetReloadsFn
  getRequest: <ResultType, ErrorType>(key: KeyType) => DataLoader<ResultType, ErrorType>
  reload: (key: KeyType) => Promise<void>
  reloadAll: () => Promise<void>
  reloadAllActive: () => Promise<void>
  reloadGroup: (startKey: KeyType) => Promise<void>
  reloadGroupActive: (startKey: KeyType) => Promise<void>
}

export const DataLoaderContext: Context<IDataLoaderContext> =
  // @ts-expect-error we force the context to undefined, should be corrected with default values
  createContext<IDataLoaderContext>(undefined)

export const useDataLoaderContext = (): IDataLoaderContext => useContext(DataLoaderContext)
