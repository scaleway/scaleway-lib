import { useCallback } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { marshalQueryKey } from './helpers'
import type { KeyType, UseDataLoaderReloadResult } from './types'

export function useDataLoaderReload(): UseDataLoaderReloadResult {
  const {
    reloadAll,
    reloadAllActive,
    reload: reloadBase,
    reloadGroup: reloadGroupBase,
    reloadGroupActive: reloadGroupActiveBase,
  } = useDataLoaderContext()

  const reload = useCallback(
    async (key: KeyType) => reloadBase(marshalQueryKey(key)),
    [reloadBase],
  )

  const reloadGroup = useCallback(
    async (startKey: KeyType) => reloadGroupBase(marshalQueryKey(startKey)),
    [reloadGroupBase],
  )

  const reloadGroupActive = useCallback(
    async (startKey: KeyType) =>
      reloadGroupActiveBase(marshalQueryKey(startKey)),
    [reloadGroupActiveBase],
  )

  return {
    reload,
    reloadAll,
    reloadAllActive,
    reloadGroup,
    reloadGroupActive,
  }
}
