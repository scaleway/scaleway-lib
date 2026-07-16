import type { Location } from 'history'
import { createContext, useContext } from 'react'

export const LocationContext = createContext<Location | null>(null)

export function useLocation(): Location {
  const location = useContext(LocationContext)
  if (location === null) {
    throw new Error('Missing RouterContext, make sure you are inside a Router')
  }
  return location
}
