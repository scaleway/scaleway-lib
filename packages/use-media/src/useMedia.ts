import { useEffect, useLayoutEffect, useState } from 'react'
import { Effect, MediaQueryObject } from './types'
import { noop, queryObjectToString } from './utilities'

export const mockMediaQueryList: MediaQueryList = {
  addEventListener: noop,
  addListener: noop,
  dispatchEvent: () => true,
  matches: false,
  media: '',
  onchange: noop,
  removeEventListener: noop,
  removeListener: noop,
}

const createUseMedia =
  (effect: Effect) =>
  (rawQuery: string | MediaQueryObject, defaultState = false) => {
    const [state, setState] = useState(defaultState)
    const query = queryObjectToString(rawQuery)

    effect(() => {
      let mounted = true
      const mediaQueryList: MediaQueryList =
        typeof window === 'undefined'
          ? mockMediaQueryList
          : window.matchMedia(query)

      const onChange = () => {
        if (!mounted) {
          return
        }

        setState(Boolean(mediaQueryList.matches))
      }

      mediaQueryList.addListener(onChange)
      setState(mediaQueryList.matches)

      return () => {
        mounted = false
        mediaQueryList.removeListener(onChange)
      }
    }, [query])

    return state
  }

export const useMedia = createUseMedia(useEffect)
export const useMediaLayout = createUseMedia(useLayoutEffect)
