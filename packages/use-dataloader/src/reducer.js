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
        data: action.data,
        status: StatusEnum.SUCCESS,
      }
    case ActionEnum.ON_UPDATE_DATA:
      return {
        ...state,
        data: action.data,
      }
    case ActionEnum.RESET:
      return {
        status: StatusEnum.IDLE,
        data: action.data,
        error: undefined,
      }
    case ActionEnum.ON_ERROR:
      return {
        ...state,
        error: action.error,
        status: StatusEnum.ERROR,
      }
  }
}
