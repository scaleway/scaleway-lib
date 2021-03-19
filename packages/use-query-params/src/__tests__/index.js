import { act, renderHook } from '@testing-library/react-hooks'
import useQueryParam from '../index'

// eslint-disable-next-line react/prop-types
const wrapper = ({ pathname = 'one', search }) => ({ children }) => {
  window.history.replaceState(
    window.history.state,
    null,
    `${pathname}?${search}`,
  )

  return children
}

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

  it('should correctly set different objects before rerender', async () => {
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
    const { result } = renderHook(() => useQueryParam(), {
      wrapper: wrapper({ search: '' }),
    })
    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })
    act(() => {
      result.current.setQueryParams({ lastName: 'Doe' })
    })
    act(() => {
      result.current.setQueryParams({ compagny: 'Scaleway' })
    })

    expect(result.current.queryParams).toEqual({
      name: 'John',
      lastName: 'Doe',
      compagny: 'Scaleway',
    })
  })
})
