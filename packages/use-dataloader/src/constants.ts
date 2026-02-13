const SECOND = 1000 as const
const MINUTE: number = 60 * SECOND
const HOUR: number = 60 * MINUTE

export enum StatusEnum {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export const DEFAULT_MAX_CONCURRENT_REQUESTS = 20 as const

export type KeyPolling = '3S' | '5S' | '10S'
export type TimeMapPolling = Record<KeyPolling, number>

export const POLLING_INTERVAL: TimeMapPolling = {
  '3S': 3 * SECOND,
  '5S': 5 * SECOND,
  '10S': 10 * SECOND,
} as const

export type KeyDataLifeTime =
  | '1h'
  | '1m'
  | '2h'
  | '3m'
  | '5m'
  | '5S'
  | '10S'
  | '30S'
  | 'NONE'
export type TimeMapDataLifeTime = Record<KeyDataLifeTime, number>

export const DATALIFE_TIME: TimeMapDataLifeTime = {
  '1h': HOUR,
  '1m': MINUTE,
  '2h': 2 * HOUR,
  '3m': 3 * MINUTE,
  '5m': 5 * MINUTE,
  '5S': 5 * SECOND,
  '10S': 10 * SECOND,
  '30S': 30 * SECOND,
  NONE: 0,
} as const
