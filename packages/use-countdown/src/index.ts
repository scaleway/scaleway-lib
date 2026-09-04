import { useEffect, useState } from 'react'

type UseCountdownProps = {
  duration?: number
  start?: boolean
}

export const useCountdown = ({ duration = 10, start = false }: UseCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [started, setStarted] = useState(start)

  useEffect(() => {
    if (started) {
      const intervalId = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setStarted(false)
            clearInterval(intervalId)
            return 0
          }
          return t - 1
        })
      }, 1000)

      return () => {
        clearInterval(intervalId)
      }
    }

    return undefined
  }, [started])

  const startCountdown = () => {
    setStarted(true)
    setTimeLeft(duration)
  }

  return { startCountdown, timeLeft }
}
