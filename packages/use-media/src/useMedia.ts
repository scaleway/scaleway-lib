import { useEffect, useLayoutEffect, useState } from 'react'
import type { Effect } from './types'

function noop() {}

export const mockMediaQueryList: MediaQueryList = {
  addEventListener: noop,
  addListener: noop,
  dispatchEvent: /* istanbul ignore next */ () => true,
  matches: false,
  media: '',
  onchange: noop,
  removeEventListener: noop,
  removeListener: noop,
}

type MediaEffect = (query: string, defaultState?: boolean) => boolean

const createUseMedia =
  (effect: Effect) =>
  (query: string, defaultState = false): boolean => {
    const [state, setState] = useState(defaultState)

    effect(() => {
      let mounted = true
      const mediaQueryList: MediaQueryList =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'undefined'
          ? mockMediaQueryList
          : window.matchMedia(query)

      const onChange = () => {
        if (!mounted) {
          return
        }

        setState(Boolean(mediaQueryList.matches))
      }

      mediaQueryList.addEventListener('change', onChange)
      setState(mediaQueryList.matches)

      return () => {
        mounted = false
        mediaQueryList.removeEventListener('change', onChange)
      }
    }, [query])

    return state
  }

export const useMedia: MediaEffect = createUseMedia(useEffect)
export const useMediaLayout: MediaEffect = createUseMedia(useLayoutEffect)
