import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, delay?: number) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback?.current?.()
      }, delay ?? 0)

      return () => {
        clearInterval(id)
      }
    }

    return () => {}
  }, [delay])
}
