import type { Location } from 'history'
import { useSyncExternalStore } from 'react'
import { useHistory } from './useHistory'

export function useLocation(): Location {
  const history = useHistory()

  return useSyncExternalStore<Location>(
    onChange => history.listen(onChange),
    () => history.location,
  )
}
