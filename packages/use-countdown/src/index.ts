import { useEffect, useState } from 'react'

type UseCountdownProps = {
  duration?: number
  start?: boolean
}

export const useCountdown = ({ duration = 10, start = false }: UseCountdownProps) => {
  const [timeLeft, setTimeLeftLeft] = useState(duration)
  const [started, setStarted] = useState(start)

  useEffect(() => {
    if (started) {
      const intervalId = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeftLeft(timeLeft - 1)
        } else {
          setStarted(false)
          clearInterval(intervalId)
        }
      }, 1000)

      return () => {
        clearInterval(intervalId)
      }
    }

    return undefined
  }, [timeLeft, started, duration])

  const startCountdown = () => {
    setStarted(true)
    setTimeLeftLeft(duration)
  }

  return { startCountdown, timeLeft }
}
