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
    case ActionEnum.ON_LOAD_MORE:
      return {
        ...state,
        error: undefined,
        status: StatusEnum.LOAD_MORE,
      }
    case ActionEnum.ON_SUCCESS: {
      const newData = action.data
      const tmp = [...state.data]
      tmp.splice(
        (state.page - 1) * state.pageSize,
        state.pageSize,
        ...newData.slice(0, state.pageSize),
      )

      const newPagedData = { ...state.paginatedData }
      newPagedData[state.page] = newData.slice(0, state.pageSize)

      return {
        ...state,
        error: undefined,
        paginatedData: newPagedData,
        data: tmp,
        status: StatusEnum.SUCCESS,
        canLoadMore: newPagedData[state.page]?.length === state.pageSize,
      }
    }
    case ActionEnum.ON_ERROR:
      return {
        ...state,
        error: action.error,
        status: StatusEnum.ERROR,
      }
    case ActionEnum.ON_UPDATE_DATA: {
      const newData = action.data
      const paginatedData = Array.from(
        { length: Math.ceil(newData.length / state.pageSize) },
        (_, index) => index,
      ).reduce(
        (acc, pageIndex) => ({
          ...acc,
          [pageIndex + 1]: state.data.slice(
            pageIndex * action.pageSize,
            (pageIndex + 1) * action.pageSize,
          ),
        }),
        {},
      )

      return {
        ...state,
        data: newData,
        canLoadMore: true,
        paginatedData,
      }
    }
    case ActionEnum.CHANGE_PAGE:
      return {
        ...state,
        previousPage: state.page,
        page: action.page,
      }
    case ActionEnum.CHANGE_PAGE_SIZE: {
      const paginatedData = Array.from(
        { length: Math.ceil(state.data.length / action.pageSize) },
        (_, index) => index,
      ).reduce(
        (acc, pageIndex) => ({
          ...acc,
          [pageIndex + 1]: state.data.slice(
            pageIndex * action.pageSize,
            (pageIndex + 1) * action.pageSize,
          ),
        }),
        {},
      )

      return {
        ...state,
        previousPage: 1,
        page: 1,
        pageSize: action.pageSize,
        paginatedData,
      }
    }
    case ActionEnum.ON_EMPTY_DATA:
      return {
        ...state,
        page: state.previousPage > 1 ? state.previousPage : 1,
        status: StatusEnum.SUCCESS,
        canLoadMore: false,
      }
    case ActionEnum.ON_UPDATE_PAGE_DATA:
      return {
        ...state,
        pageData: {
          ...state.pageData,
          [state.page]: action.data,
        },
        canLoadMore: false,
      }
    case ActionEnum.RESET:
      return {
        ...state,
        status: StatusEnum.IDLE,
        data: [],
        paginatedData: {},
        error: undefined,
        canLoadMore: true,
      }
  }
}
