import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WindowEventMap {
    // native storage event is not broadcasted on the current page
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
    // So we also emit a custom one to allow current page handling
    'event-storage': CustomEvent
  }
}

const canUseDOM =
  typeof window !== 'undefined' &&
  !!(
    typeof window.document !== 'undefined' &&
    typeof window.localStorage !== 'undefined' &&
    typeof window.sessionStorage !== 'undefined'
  )

const createMemoryStorage = (): Storage => {
  const storage: { [key: string]: string | null } = {}

  return {
    length: Object.entries(storage).length,
    clear() {
      Object.keys(storage).forEach(key => {
        delete storage[key]
      })
    },
    key(index) {
      return Object.values(storage)[index] ?? null
    },
    getItem(key) {
      return storage[key] ?? null
    },
    setItem(key, value) {
      storage[key] = value
    },
    removeItem(key) {
      delete storage[key]
    },
  }
}

const getStorage = (name: 'localStorage' | 'sessionStorage') =>
  canUseDOM ? window[name] : createMemoryStorage()

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
      options?.kind === 'session'
        ? getStorage('sessionStorage')
        : getStorage('localStorage'),
    [options?.kind],
  )

  const [localValue, setLocaleValue] = useState<string | null>(() =>
    options?.initialValue ? JSON.stringify(options.initialValue) : null,
  )

  const value = useSyncExternalStore(
    subscribeStorage,
    () => storage.getItem(key),
    /* istanbul ignore next */
    () => localValue,
  )

  useEffect(() => {
    setLocaleValue(value)
  }, [value])

  const setValue = useCallback(
    (val: T | undefined) => {
      if (val !== undefined) {
        if (canUseDOM) {
          storage.setItem(key, JSON.stringify(val))
        }
        setLocaleValue(JSON.stringify(val))
      } else {
        if (canUseDOM) {
          storage.removeItem(key)
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
