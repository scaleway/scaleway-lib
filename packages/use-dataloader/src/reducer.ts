/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { ActionEnum, StatusEnum } from './constants'

interface State {
  [key: string]: unknown,
  error?: Error,
  status: string,
}

export default (state: State, action: { type: string, error?: Error }): State => {
  switch (action.type) {
    case ActionEnum.ON_LOADING:
      return {
        ...state,
        error: undefined,
        status: StatusEnum.LOADING,
      }
    case ActionEnum.ON_SUCCESS:
      return {
        ...state,
        error: undefined,
        status: StatusEnum.SUCCESS,
      }
    case ActionEnum.RESET:
      return {
        error: undefined,
        status: StatusEnum.IDLE,
      }
    case ActionEnum.ON_ERROR:
      return {
        ...state,
        error: action.error,
        status: StatusEnum.ERROR,
      }
  }

  return state
}
