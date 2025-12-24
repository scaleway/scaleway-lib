const SECOND: number = 1000
const MINUTE: number = 60 * SECOND
const HOUR: number = 60 * MINUTE

export enum StatusEnum {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export const KEY_IS_NOT_STRING_ERROR: string = 'Key should be a string'
export const DEFAULT_MAX_CONCURRENT_REQUESTS: number = 20

export type TimeMap = { [key: string]: number }

export const POLLING_INTERVAL: TimeMap = {
  '3S': 3 * SECOND,
  '5S': 5 * SECOND,
  '10S': 10 * SECOND,
} as const

export const DATALIFE_TIME: TimeMap = {
  '1h': 1 * HOUR,
  '1m': 1 * MINUTE,
  '2h': 2 * HOUR,
  '3m': 3 * MINUTE,
  '5m': 5 * MINUTE,
  '5S': 5 * SECOND,
  '10S': 10 * SECOND,
  '30S': 30 * SECOND,
  NONE: 0,
} as const
