const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

export enum StatusEnum {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export const KEY_IS_NOT_STRING_ERROR = 'Key should be a string'
export const DEFAULT_MAX_CONCURRENT_REQUESTS = 20

export const POLLING_INTERVAL = {
  '10S': 10 * SECOND,
  '5S': 5 * SECOND,
  '3S': 3 * SECOND,
} as const

export const DATALIFE_TIME = {
  '2h': 2 * HOUR,
  '1h': 1 * HOUR,
  '5m': 5 * MINUTE,
  '3m': 3 * MINUTE,
  '1m': 1 * MINUTE,
  '30S': 30 * SECOND,
  '10S': 10 * SECOND,
  '5S': 5 * SECOND,
  NONE: 0,
} as const
