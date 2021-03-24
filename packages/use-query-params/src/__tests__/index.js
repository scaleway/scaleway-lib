import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { MemoryRouter, useHistory } from 'react-router-dom'
import useQueryParam from '..'

// eslint-disable-next-line react/prop-types
const wrapper = ({ pathname = 'one', search }) => ({ children }) => (
  <MemoryRouter initialIndex={0} initialEntries={[{ pathname, search }]}>
    {children}
  </MemoryRouter>
)

describe('useQueryParam', () => {
  it('should set one object', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    act(() => {
      result.current.setQueryParams({ user: 'John' })
    })
    expect(result.current.queryParams).toEqual({ user: 'John' })
  })

  it('should correctly set with different value', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    act(() => {
      result.current.setQueryParams({ user: 'John' })
    })
    expect(result.current.queryParams).toEqual({ user: 'John' })

    act(() => {
      result.current.setQueryParams({ user: 'Doe', name: 'Doe' })
    })
    expect(result.current.queryParams).toEqual({ user: 'Doe', name: 'Doe' })

    act(() => {
      result.current.setQueryParams({ user: 'Scaleway' })
    })
    expect(result.current.queryParams).toEqual({
      user: 'Scaleway',
      name: 'Doe',
    })
  })

  it('should set one complexe object', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    act(() => {
      result.current.setQueryParams({
        user: 'John Doe',
        name: 'John',
        lastName: 'Doe',
        version: 1234,
        lib: 'useQueryParams',
      })
    })
    expect(result.current.queryParams).toEqual({
      user: 'John Doe',
      name: 'John',
      lastName: 'Doe',
      version: 1234,
      lib: 'useQueryParams',
    })
  })

  it('should get queryParams from existing location', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    expect(result.current.queryParams).toEqual({ user: 'john' })
  })

  it('should should handle array, boolean, number and string from existing location', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({
        search: 'string=john&boolean=true&number=123&array=handle,array,format',
      }),
    })

    expect(result.current.queryParams).toEqual({
      string: 'john',
      boolean: true,
      number: 123,
      array: ['handle', 'array', 'format'],
    })
  })

  it('should get queryParams from existing location and set new params', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    expect(result.current.queryParams).toEqual({ user: 'john' })

    act(() => {
      result.current.setQueryParams({
        lastName: 'Doe',
        version: 1234,
        lib: 'useQueryParams',
      })
    })

    expect(result.current.queryParams).toEqual({
      user: 'john',
      lastName: 'Doe',
      version: 1234,
      lib: 'useQueryParams',
    })
  })

  it('should correctly set different objects before rerender', () => {
    const { result, rerender } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ name: 'JOHN' })
    })

    act(() => {
      result.current.setQueryParams({ lastName: 'Doe' })
    })
    expect(result.current.queryParams).toEqual({
      name: 'JOHN',
      lastName: 'Doe',
    })

    rerender()

    act(() => {
      result.current.setQueryParams({ name: 'john' })
    })

    act(() => {
      result.current.setQueryParams({ test: 'Scaleway' })
    })

    expect(result.current.queryParams).toEqual({
      name: 'john',
      lastName: 'Doe',
      test: 'Scaleway',
    })
  })

  test('should render good params with parallel changes', async () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: '' }),
    })
    act(() => {
      result.current.setQueryParams({ name: 'John' })
      result.current.setQueryParams({ lastName: 'Doe' })
      result.current.setQueryParams({ compagny: 'Scaleway' })
    })

    jest.runAllTimers()

    expect(result.current.queryParams).toEqual({
      name: 'John',
      lastName: 'Doe',
      compagny: 'Scaleway',
    })

    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })

    jest.runAllTimers()

    expect(result.current.queryParams).toEqual({
      name: 'John',
      lastName: 'Doe',
      compagny: 'Scaleway',
    })
  })

  test('should erase params', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })
    expect(result.current.queryParams).toEqual({
      name: 'John',
    })
    act(() => {
      result.current.setQueryParams({ lastName: 'Doe' })
    })
    expect(result.current.queryParams).toEqual({
      name: 'John',
      lastName: 'Doe',
    })
    act(() => {
      result.current.replaceQueryparams({ compagny: 'Scaleway' })
    })
    expect(result.current.queryParams).toEqual({
      compagny: 'Scaleway',
    })
  })

  test('should correctly set query params with array', () => {
    jest.useFakeTimers()
    const { result, rerender } = renderHook(
      () => [useQueryParam(), useHistory()],
      {
        wrapper: wrapper({ search: '' }),
      },
    )

    act(() => {
      result.current[0].setQueryParams({
        names: ['John', null, 'Jane', null, undefined, ''],
      })
    })
    jest.runAllTimers()
    expect(result.current[0].queryParams).toEqual({
      names: ['John', null, 'Jane', null, undefined, ''],
    })
    expect(result.current[1].location.search).toEqual('?names=John,Jane')

    rerender()
  })

  test('should correctly with existing array', () => {
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: 'names=John,,Jane,,,' }),
    })

    expect(result.current.queryParams).toEqual({
      names: ['John', '', 'Jane', '', '', ''],
    })
  })

  test('should work correctly when search is empty', () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })
    jest.runAllTimers()
    expect(result.current.queryParams).toEqual({
      name: 'John',
    })

    act(() => {
      result.current.replaceQueryparams({})
    })
    jest.runAllTimers()
    expect(result.current.queryParams).toEqual({})
  })
})
