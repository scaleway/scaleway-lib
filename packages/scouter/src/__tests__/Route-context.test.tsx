// oxlint-disable vitest/require-top-level-describe
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { Location, Match } from '../index'
import { MemoryRouter, Route } from '../index'

test('provides match to render prop', () => {
  let match: Match | undefined = undefined

  render(
    <MemoryRouter initialEntries={['/test']}>
      <Route
        path="/test"
        render={({ match: matchProps }) => {
          match = matchProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(match!).toBeDefined()
  expect(match!.params).toBeDefined()
  expect(match!.isExact).toBeDefined()
})

test('provides location to render prop', () => {
  let location: Location | undefined = undefined

  render(
    <MemoryRouter initialEntries={['/test?foo=bar']}>
      <Route
        path="/test"
        render={({ location: locationProps }) => {
          location = locationProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(location!).toBeDefined()
  expect(location!.pathname).toBe('/test')
  expect(location!.search).toBe('?foo=bar')
})

test('match has isExact flag', () => {
  let exactMatch: Match | undefined = undefined
  let looseMatch: Match | undefined = undefined

  render(
    <MemoryRouter initialEntries={['/test/extra']}>
      <Route
        exact
        path="/test"
        render={props => {
          exactMatch = props.match
          return null
        }}
      />
      <Route
        path="/test"
        render={props => {
          looseMatch = props.match
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(exactMatch!).toBeUndefined()
  expect(looseMatch!).toBeDefined()
  expect(looseMatch!.isExact).toBe(false)
})

test('match params are decoded', () => {
  let match: Match | undefined = undefined

  render(
    <MemoryRouter initialEntries={['/test/hello%20world']}>
      <Route
        path="/test/:param"
        render={({ match: matchProps }) => {
          match = matchProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(match!.params['param']).toBe('hello world')
})
