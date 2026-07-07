import type { Transition } from 'history'
import { useLayoutEffect } from 'react'
import { useHistory } from './useHistory'

type PromptProps = {
  message: string
  when?: boolean | ((tx: Transition) => boolean)
}

export const Prompt = ({ message, when = true }: PromptProps) => {
  const history = useHistory()

  useLayoutEffect(() => {
    if (typeof when !== 'function' && !when) {
      return undefined
    }

    const unblock = history.block(tx => {
      const shouldBlock = typeof when === 'boolean' ? when : when(tx)
      if (!shouldBlock || globalThis.confirm(message)) {
        unblock()
        return tx.retry()
      }
    })
    return unblock
  })

  return null
}
