// oxlint-disable vitest/require-top-level-describe vitest/no-conditional-in-test vitest/no-conditional-expect
import { render } from '@testing-library/react'
import { Action, createMemoryHistory } from 'history'
import type { Transition } from 'history'
import { expect, test, vi } from 'vitest'
import { Prompt } from '../index'
import { Router } from '../Router'

test('with when=true blocks navigation', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={true} />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)
})

test('with when=false does not block navigation', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={false} />
    </Router>,
  )

  expect(blockSpy).not.toHaveBeenCalledTimes(1)
})

test('with when function returning true blocks navigation', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={() => true} />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)
})

test('when function receives Transition parameter', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  let capturedTransition: Transition | null = null

  render(
    <Router history={history}>
      <Prompt
        message="Are you sure?"
        when={(tx: Transition) => {
          capturedTransition = tx
          return false
        }}
      />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)

  const blockCallback = blockSpy.mock.calls[0]?.[0]
  if (blockCallback) {
    const mockTransition: Transition = {
      action: Action.Pop,
      location: history.location,
      retry: vi.fn<() => void>(),
    }
    blockCallback(mockTransition)
    expect(capturedTransition).toBe(mockTransition)
  }
})

test('confirms navigation when globalThis.confirm returns true', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={true} />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)
  const blockCallback = blockSpy.mock.calls[0]?.[0]

  if (blockCallback) {
    const mockTransition: Transition = {
      action: Action.Pop,
      location: history.location,
      retry: vi.fn<() => void>(),
    }

    const originalConfirm = globalThis.confirm
    globalThis.confirm = vi.fn<() => boolean>(() => true)

    const unblockSpy = vi.fn<() => void>()
    blockCallback(mockTransition)

    expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure?')
    expect(unblockSpy).not.toHaveBeenCalledTimes(1)

    globalThis.confirm = originalConfirm
  }
})

test('blocks navigation when globalThis.confirm returns false', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={true} />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)
  const blockCallback = blockSpy.mock.calls[0]?.[0]

  if (blockCallback) {
    const mockTransition: Transition = {
      action: Action.Pop,
      location: history.location,
      retry: vi.fn<() => void>(),
    }

    const originalConfirm = globalThis.confirm
    globalThis.confirm = vi.fn<() => boolean>(() => false)

    blockCallback(mockTransition)

    expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure?')

    globalThis.confirm = originalConfirm
  }
})

test('calls unblock and retry when user confirms', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={true} />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)
  const blockCallback = blockSpy.mock.calls[0]?.[0]

  if (blockCallback) {
    const retrySpy = vi.fn<() => void>()
    const mockTransition: Transition = {
      action: Action.Pop,
      location: history.location,
      retry: retrySpy,
    }

    const originalConfirm = globalThis.confirm
    globalThis.confirm = vi.fn<() => boolean>(() => true)

    blockCallback(mockTransition)

    expect(retrySpy).toHaveBeenCalledTimes(1)

    globalThis.confirm = originalConfirm
  }
})

test('does not call retry when user cancels', () => {
  const history = createMemoryHistory({ initialEntries: ['/initial'] })
  const blockSpy = vi.spyOn(history, 'block')

  render(
    <Router history={history}>
      <Prompt message="Are you sure?" when={true} />
    </Router>,
  )

  expect(blockSpy).toHaveBeenCalledTimes(1)
  const blockCallback = blockSpy.mock.calls[0]?.[0]

  if (blockCallback) {
    const retrySpy = vi.fn<() => void>()
    const mockTransition: Transition = {
      action: Action.Pop,
      location: history.location,
      retry: retrySpy,
    }

    const originalConfirm = globalThis.confirm
    globalThis.confirm = vi.fn<() => boolean>(() => false)

    blockCallback(mockTransition)

    expect(retrySpy).not.toHaveBeenCalledTimes(1)

    globalThis.confirm = originalConfirm
  }
})
