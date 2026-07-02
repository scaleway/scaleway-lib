import { useCallback } from 'react'
import { useHistory } from '../useHistory'

// Polyfill useNavigate for react-router v5
export const useNavigate = () => {
  const history = useHistory()

  const navigate = useCallback(
    (
      to: Parameters<ReturnType<typeof useHistory>['push']>[0],
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
