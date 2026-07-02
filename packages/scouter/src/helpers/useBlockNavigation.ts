import type { Location, Transition } from 'history'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useHistory } from '../useHistory'

export type ShouldBlockCallback = (tx: Transition, currentLocation: Location) => boolean

export type UseBlockNavigationOptions = {
  /**
   * Dynamically called when a user tries to navigate
   * Default to newPathname !== currentPathname
   **/
  shouldBlock?: ShouldBlockCallback
  /**
   * Initial value of enable state, updating this after initial render does nothing, use setEnabled instead
   * Default to true
   */
  initialEnabled?: boolean
  /**
   * Direct control of the enabled state, if you use both this and the setEnabled, navigation is blocked if one of the 2 is true
   */
  enabled?: boolean
}

export type UseBlockNavigationResult = {
  /**
   * Control wether blocking is enabled or not
   * When enabled, an beforeunload handler is registered meaning the Borwser will prompt the user when trying to close the tab
   */
  enabled: boolean
  /**
   * Change the enabled state
   * @param value
   * @returns
   */
  setEnabled: (value: boolean) => void
  /**
   * True when user tried to navigate and teh navigation was blocked (shouldBlock returned true)
   */
  hasPendingNavigation: boolean
  /**
   * When hasPendingNavigation === true, use this to continue the previously blocked navigation
   * @param overrideLocation
   * @returns
   */
  continueNavigation: () => void
  /**
   * When hasPendingNavigation === true, use this to ignore the blocked navigation
   */
  discardNavigation: () => void
  /**
   * Immediatly unblock the navigation, bypassing the enable / setEnabled states
   * This allows you to navigate right after, for example in a form at the end of submitting
   * Note that it will bypass the enabled state only until the next render loop
   */
  unblockImmediatly: () => void
}

const defaultShouldBlock: ShouldBlockCallback = ({ location }, { pathname }) => location.pathname !== pathname

export const useBlockNavigation = (options: UseBlockNavigationOptions = {}): UseBlockNavigationResult => {
  const { initialEnabled = false, enabled: staticEnabled = false, shouldBlock = defaultShouldBlock } = options

  const history = useHistory()

  const unblockRef = useRef<null | (() => void)>(null)

  const [blockedNav, setBlockedNav] = useState<null | Transition>(null)

  const [dynamicEnabled, setDynamicEnabled] = useState(initialEnabled)

  // This state if used to force re-run the effect after unblockImmediatly is called
  const [effectCounter, setEffectCounter] = useState(0)

  const enabled = staticEnabled || dynamicEnabled

  useLayoutEffect(() => {
    if (!enabled) {
      unblockRef.current = null
      setBlockedNav(null)
      return undefined
    }

    const unblock = history.block(tx => {
      const shouldBlockNav = shouldBlock(tx, history.location)

      if (!shouldBlockNav) {
        unblock()
        tx.retry()
        // Make sure we re-block after navigating
        setEffectCounter(p => p + 1)
        return
      }
      setBlockedNav(tx)
    })
    unblockRef.current = unblock
    return unblock
  }, [shouldBlock, history, enabled, effectCounter])

  const continueNavigation = useCallback(() => {
    if (!enabled || !blockedNav) {
      return
    }
    unblockRef.current?.()
    blockedNav.retry()
    setBlockedNav(null)
  }, [enabled, blockedNav])

  const discardNavigation = useCallback(() => {
    if (!enabled || !blockedNav) {
      return
    }
    setBlockedNav(null)
  }, [enabled, blockedNav])

  const unblockImmediatly = useCallback(() => {
    unblockRef.current?.()
    // force re-run effect to keep the block active on the next render loop
    setEffectCounter(p => p + 1)
  }, [])

  return {
    enabled,
    hasPendingNavigation: enabled && blockedNav !== null,
    setEnabled: setDynamicEnabled,
    continueNavigation,
    discardNavigation,
    unblockImmediatly,
  }
}
