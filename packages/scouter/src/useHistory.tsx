import type { History } from 'history'
import { createContext, useContext } from 'react'

export const HistoryContext = createContext<History | null>(null)

export function useHistory(): History {
  const ctx = useContext(HistoryContext)
  if (ctx === null) {
    throw new Error('Missing RouterContext')
  }
  return ctx
}
