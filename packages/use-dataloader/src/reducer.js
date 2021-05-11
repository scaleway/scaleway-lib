/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { ActionEnum, StatusEnum } from './constants'

export default (state, action) => {
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
}
