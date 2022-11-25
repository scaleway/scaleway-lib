import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { flushSync } from 'react-dom'

declare global {
  interface WindowEventMap {
    'event-storage': CustomEvent
  }
}

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  typeof window?.document !== 'undefined' &&
  typeof window?.localStorage !== 'undefined' &&
  typeof window?.sessionStorage !== 'undefined'
)

const subscribeStorage = (callback: () => void) => {
  if (canUseDOM) {
    window.addEventListener('storage', callback)
    window.addEventListener('event-storage', callback)
  }

  return () => {
    if (canUseDOM) {
      window.removeEventListener('storage', callback)
      window.removeEventListener('event-storage', callback)
    }
  }
}

const useStorage = <T>(
  key: string,
  options?: {
    initialValue?: T
    kind?: 'session' | 'local'
  },
): [T | null, (value: T | undefined) => void] => {
  const storage = useMemo(
    () =>
      options?.kind === 'session' ? window.sessionStorage : window.localStorage,
    [options?.kind],
  )

  const [localValue, setLocaleValue] = useState<string | null>(() =>
    options?.initialValue ? JSON.stringify(options?.initialValue) : null,
  )

  const value = useSyncExternalStore(
    subscribeStorage,
    () => storage.getItem(key),
    () => localValue,
  )

  useEffect(() => {
    setLocaleValue(value)
  }, [value])

  const setValue = useCallback(
    (val: T | undefined) => {
      if (val) {
        if (canUseDOM) {
          flushSync(() => storage.setItem(key, JSON.stringify(val)))
        }
        setLocaleValue(JSON.stringify(val))
      } else {
        if (canUseDOM) {
          flushSync(() => storage.removeItem(key))
        }
        setLocaleValue(null)
      }

      if (canUseDOM) {
        window.dispatchEvent(new Event('local-storage'))
      }
    },
    [key, storage],
  )

  const parsedValue = useMemo(() => {
    if (value) {
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

export const useSessionStorage = <T>(key: string, initialValue?: T) =>
  useStorage<T>(key, { initialValue, kind: 'session' })
export const useLocalStorage = <T>(key: string, initialValue?: T) =>
  useStorage<T>(key, { initialValue, kind: 'local' })
