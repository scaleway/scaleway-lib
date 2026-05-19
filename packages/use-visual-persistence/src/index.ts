import { useLocalStorage } from '@scaleway/use-storage'
import { useCallback } from 'react'

export const useVisualPersistence = (key: string, options: { usePrefix: boolean } = { usePrefix: true }) => {
  const finalKey = options.usePrefix ? `visualPersistency.${key}` : key

  const [isHidden, setIsHidden] = useLocalStorage<boolean>(finalKey)

  const hide = useCallback(() => {
    setIsHidden(true)
  }, [setIsHidden])

  const restore = useCallback(() => {
    setIsHidden(false)
  }, [setIsHidden])

  return {
    hide,
    isHidden: !!isHidden,
    restore,
  }
}
