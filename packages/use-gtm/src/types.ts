type PrimitiveType = string | number | boolean | null | undefined | Date
export type DataLayerEvent = Record<string, PrimitiveType>
export type SendGTM = (event: DataLayerEvent) => void
export type GTMEnvironment = {
  auth: string
  preview?: string
}

export type EventFunction = (...args: never[]) => void
export type Events = Record<string, (sendGTM: SendGTM) => EventFunction>
