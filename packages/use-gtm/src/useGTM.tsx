import { ReactNode, createContext, useContext, useEffect, useMemo } from 'react'
import generateScripts, { DATALAYER_NAME, LOAD_ERROR_EVENT } from './scripts'
import { DataLayerEvent, Events, GTMEnvironment, SendGTM } from './types'

interface GTMContextInterface<T extends Events = Events> {
  sendGTM: SendGTM | undefined
  events: { [K in keyof T]: ReturnType<T[K]> }
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[] | undefined
  }
}

export const sendGTM = (data: DataLayerEvent) => {
  window?.[DATALAYER_NAME]?.push(data)
}

const GTMContext = createContext<GTMContextInterface | undefined>(undefined)

export function useGTM<T extends Events>(): GTMContextInterface<T> {
  // @ts-expect-error Here we force cast the generic onto the useContext because the context is a
  // global variable and cannot be generic
  const context = useContext<GTMContextInterface<T> | undefined>(GTMContext)
  if (context === undefined) {
    throw new Error('useGTM must be used within a GTMProvider')
  }

  return context
}

export type GTMProviderProps<T> = {
  id: string
  environment?: GTMEnvironment
  children: ReactNode
  onLoadError?: () => void
  events?: T
}

function GTMProvider<T extends Events>({
  children,
  id,
  environment,
  onLoadError,
  events,
}: GTMProviderProps<T>) {
  useEffect(() => {
    const { noScript, script, dataLayerInit } = generateScripts(id, environment)

    document.head.insertBefore(dataLayerInit, document.head.childNodes[0])
    document.head.insertBefore(script, document.head.childNodes[1])
    document.body.insertBefore(noScript, document.body.childNodes[0])

    if (onLoadError) document.addEventListener(LOAD_ERROR_EVENT, onLoadError)

    return () => {
      if (onLoadError)
        document.removeEventListener(LOAD_ERROR_EVENT, onLoadError)
    }
  }, [environment, id, onLoadError])

  const value = useMemo<GTMContextInterface<T>>(() => {
    const curiedEvents = Object.entries(events || {}).reduce(
      (acc, [eventName, eventFn]) => ({
        ...acc,
        [eventName]: eventFn(sendGTM),
      }),
      {},
    ) as { [K in keyof T]: ReturnType<T[K]> }

    return {
      events: curiedEvents,
      sendGTM,
    }
  }, [events])

  return <GTMContext.Provider value={value}>{children}</GTMContext.Provider>
}

export default GTMProvider
