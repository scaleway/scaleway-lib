import { DataLoaderStatus } from './types'

export const StatusEnum: Record<
  'ERROR' | 'IDLE' | 'LOADING' | 'SUCCESS',
  DataLoaderStatus
> = {
  ERROR: 'error',
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
}

export const ActionEnum = {
  ON_ERROR: 'ON_ERROR',
  ON_LOADING: 'ON_LOADING',
  ON_SUCCESS: 'ON_SUCCESS',
  ON_UPDATE_DATA: 'ON_UPDATE_DATA',
  RESET: 'RESET',
}
