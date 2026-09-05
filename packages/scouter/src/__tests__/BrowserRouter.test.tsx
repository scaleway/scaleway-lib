// oxlint-disable typescript/no-unsafe-assignment typescript/no-unsafe-type-assertion typescript/no-explicit-any vitest/no-conditional-in-test typescript/unbound-method
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { History, Location, Match } from '../index'
import { BrowserRouter, Route, useHistory } from '../index'

describe('component BrowserRouter', () => {
  it('renders children', () => {
    expect.hasAssertions()

    const text = 'Hello BrowserRouter'

    render(
      <BrowserRouter>
        <div>{text}</div>
      </BrowserRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('creates browser history', () => {
    expect.hasAssertions()

    let history: History = null as any

    const Inner = () => {
      history = useHistory()
      return null
    }

    render(
      <BrowserRouter>
        <Inner />
      </BrowserRouter>,
    )

    expect(history).toBeDefined()
    expect(history.push).toBeTypeOf('function')
    expect(history.replace).toBeTypeOf('function')
  })

  it('history is re-created for each BrowserRouter', () => {
    expect.hasAssertions()

    let firstHistory: any
    let secondHistory: any

    const TestComponent = () => {
      const history = useHistory()
      if (!firstHistory) {
        firstHistory = history
      } else {
        secondHistory = history
      }
      return null
    }

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>,
    )

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>,
    )

    expect(firstHistory).not.toBe(secondHistory)
  })

  it('provides root route context', () => {
    expect.hasAssertions()

    let match: Match

    render(
      <BrowserRouter>
        <Route
          render={props => {
            match = props.match
            return null
          }}
        />
      </BrowserRouter>,
    )

    expect(match!).toBeDefined()
    expect(match!.params).toStrictEqual({})
  })

  it('uses current browser location', () => {
    expect.hasAssertions()

    let location: Location

    render(
      <BrowserRouter>
        <Route
          render={props => {
            location = props.location
            return null
          }}
        />
      </BrowserRouter>,
    )

    expect(location!).toBeDefined()
    expect(location!.pathname).toBeTypeOf('string')
  })
})
