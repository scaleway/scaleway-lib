// oxlint-disable vitest/require-top-level-describe
import { assert, expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import type { Location, Match } from '../index'
import { MemoryRouter, Route } from '../index'

test('provides match to render prop', async () => {
  let match: Partial<Match> = {}

  await render(
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

  assert.exists(match)
  expect(match.params).toBeDefined()
  expect(match.isExact).toBeDefined()
})

test('provides location to render prop', async () => {
  let location: Partial<Location> = {}

  await render(
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

  assert.exists(location)
  expect(location.pathname).toBe('/test')
  expect(location.search).toBe('?foo=bar')
})

test('match has isExact flag', async () => {
  let exactMatch: Match | undefined = undefined
  let looseMatch: Partial<Match> = {}

  await render(
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

  assert.exists(looseMatch)
  expect(exactMatch).toBeUndefined()
  expect(looseMatch).toBeDefined()
  expect(looseMatch.isExact).toBe(false)
})

test('match params are decoded', async () => {
  let match: Partial<Match> = {}

  await render(
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

  assert.exists(match)
  expect(match.params?.['param']).toBe('hello world')
})
