import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

declare global {
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface WindowEventMap {
    // native storage event is not broadcasted on the current page
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
    // So we also emit a custom one to allow current page handling
    'event-storage': CustomEvent
  }
}

const canUseDOM = typeof globalThis !== 'undefined' && 'localStorage' in globalThis && 'sessionStorage' in globalThis

const subscribeStorage = (callback: () => void) => {
  if (canUseDOM) {
    globalThis.addEventListener('storage', callback)
    globalThis.addEventListener('event-storage', callback)
  }

  return () => {
    if (canUseDOM) {
      globalThis.removeEventListener('storage', callback)
      globalThis.removeEventListener('event-storage', callback)
    }
  }
}

type ReturnStorage<T> = [T | null, (value: T | undefined) => void]

const useStorage = <T>(
  key: string,
  options?: {
    initialValue?: T
    kind?: 'session' | 'local'
  },
): ReturnStorage<T> => {
  const storage = useMemo(
    () => (options?.kind === 'session' ? globalThis.sessionStorage : globalThis.localStorage),
    [options?.kind],
  )

  const [localValue, setLocalValue] = useState<string | null>(() =>
    options?.initialValue !== undefined ? JSON.stringify(options.initialValue) : null,
  )

  const value = useSyncExternalStore(
    subscribeStorage,
    () => storage.getItem(key),
    /* istanbul ignore next */
    () => localValue,
  )

  const setValue = useCallback(
    (val: T | undefined) => {
      if (val !== undefined) {
        if (canUseDOM) {
          storage.setItem(key, JSON.stringify(val))
        }
        setLocalValue(JSON.stringify(val))
      } else {
        if (canUseDOM) {
          storage.removeItem(key)
        }
        setLocalValue(null)
      }

      if (canUseDOM) {
        globalThis.dispatchEvent(new Event('storage'))
        globalThis.dispatchEvent(new Event('event-storage'))
      }
    },
    [key, storage],
  )

  const parsedValue = useMemo(() => {
    if (value !== null) {
      try {
        return JSON.parse(value) as T
      } catch {
        return options?.initialValue ?? null
      }
    }

    return options?.initialValue ?? null
  }, [options?.initialValue, value])

  return [parsedValue, setValue]
}

export const useSessionStorage = <T>(key: string, initialValue?: T): ReturnStorage<T> =>
  useStorage<T>(key, { initialValue, kind: 'session' })
export const useLocalStorage = <T>(key: string, initialValue?: T): ReturnStorage<T> =>
  useStorage<T>(key, { initialValue, kind: 'local' })
