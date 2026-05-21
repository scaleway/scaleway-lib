import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, delay?: number | null) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback?.current?.()
      }, delay)

      return () => {
        clearInterval(id)
      }
    }

    return undefined
  }, [delay])
}
