import { createContext, useContext } from 'react'
import type { AuthScwContextType } from '../types'

export const AuthScwContext = createContext<AuthScwContextType>({} as AuthScwContextType)

export const useAuthScw = () => useContext(AuthScwContext)
