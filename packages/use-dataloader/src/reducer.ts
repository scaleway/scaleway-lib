/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { ActionEnum, StatusEnum } from './constants'

interface Action {
  type: typeof ActionEnum[keyof typeof ActionEnum];
  error?: Error;
}

interface State {
  error?: Error;
  status: typeof StatusEnum[keyof typeof StatusEnum];
  [key: string]: unknown
}

export default (state: State, action: Action): State => {
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
