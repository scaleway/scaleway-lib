import { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type BlockNavigationCallback = (location: { pathname: string }, currentPathname: string) => boolean

export const useOnLeave = (shouldBlock?: BlockNavigationCallback) => {
  const history = useHistory()
  const { pathname } = useLocation()

  // Controls if confirmation modal should be shown
  const [isConfirmationRequired, setIsConfirmationRequired] = useState(false)

  // Stores the path a user tried to navigate to
  const [nextLocation, setNextLocation] = useState('')

  // Allows navigation programmatically
  const [allowNavigationFlag, setAllowNavigationFlag] = useState(true)

  // Trigger navigation programmatically after confirmation
  const handleGoToIntendedPage = useCallback(
    (location: string) => {
      history.push(location)
    },
    [history],
  )

  // Default blocking logic: block if a user tries to leave the current route (to another path)
  const defaultShouldBlock: BlockNavigationCallback = useCallback(
    (location, currentPathname) => location.pathname !== currentPathname,
    [],
  )

  // Use custom blocking logic if provided (otherwise use default)
  const blockCallback = shouldBlock ?? defaultShouldBlock

  useEffect(() => {
    // If a user has confirmed navigation, allow and redirect
    if (allowNavigationFlag && nextLocation) {
      handleGoToIntendedPage(nextLocation)
      setAllowNavigationFlag(false)
    }

    // Listen to all route changes and potentially block them
    const unblock = history.block((location: { pathname: string }) => {
      const shouldBlockNavigation = blockCallback(location, pathname)

      // Block navigation if logic says so, and we're not explicitly allowing it
      if (shouldBlockNavigation && !allowNavigationFlag) {
        // Show modal or confirmation UI
        setIsConfirmationRequired(true)
        // Save where a user wanted to go
        setNextLocation(location.pathname)

        // Block navigation
        return false
      }

      // Let it through if a flag is true
      if (allowNavigationFlag) {
        return undefined
      }

      return undefined
    })

    // Clean up the blocking listener when a component unmounts or deps change
    return () => {
      unblock()
    }
  }, [handleGoToIntendedPage, history, nextLocation, pathname, allowNavigationFlag, blockCallback])

  return {
    // expose a way to unlock navigation (e.g., after a user clicks "Leave")
    allowNavigation: setAllowNavigationFlag,
    // tell UI to show a confirmation dialog
    isConfirmationRequired,
    setIsConfirmationRequired,
    // optional external override
    setNextLocation,
  }
}
