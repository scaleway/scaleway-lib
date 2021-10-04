export enum StatusEnum {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export enum ActionEnum {
  ON_ERROR = 'ON_ERROR',
  ON_LOADING = 'ON_LOADING',
  ON_SUCCESS = 'ON_SUCCESS',
  ON_UPDATE_DATA = 'ON_UPDATE_DATA',
  RESET = 'RESET',
}

export const KEY_IS_NOT_STRING_ERROR = 'Key should be a string'
export const DEFAULT_MAX_CONCURRENT_REQUESTS = 20
