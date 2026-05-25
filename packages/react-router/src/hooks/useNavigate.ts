import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

// Polyfill useNavigate for react-router v5
export const useNavigate = () => {
  const history = useHistory()

  const navigate = useCallback(
    (
      to: string,
      options?: {
        replace?: boolean
        state?: unknown
      },
    ) => {
      if (options?.replace) {
        history.replace(to, options?.state)
      } else {
        history.push(to, options?.state)
      }
    },
    [history],
  )

  return navigate
}
