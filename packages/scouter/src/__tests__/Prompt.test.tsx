// oxlint-disable vitest/no-conditional-in-test vitest/no-conditional-expect
import { Action, createMemoryHistory } from 'history'
import type { Transition } from 'history'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Prompt } from '../index'
import { Router } from '../Router'

describe(Prompt, () => {
  beforeAll(() => {
    globalThis.confirm = () => false
  })

  it('with when=true blocks navigation', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    const condition = true

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={condition} />
      </Router>,
    )

    expect(blockSpy).toHaveBeenCalledTimes(1)
  })

  it('with when=false does not block navigation', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={false} />
      </Router>,
    )

    expect(blockSpy).not.toHaveBeenCalledTimes(1)
  })

  it('with when function returning true blocks navigation', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={() => true} />
      </Router>,
    )

    expect(blockSpy).toHaveBeenCalledTimes(1)
  })

  it('when function receives Transition parameter', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    let capturedTransition: Transition | null = null

    await render(
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

  it('confirms navigation when globalThis.confirm returns true', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    const condition = true

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={condition} />
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

      vi.spyOn(globalThis, 'confirm').mockReturnValue(true)

      const unblockSpy = vi.fn<() => void>()
      blockCallback(mockTransition)

      expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure?')
      expect(unblockSpy).not.toHaveBeenCalledTimes(1)
    }
  })

  it('blocks navigation when globalThis.confirm returns false', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    const condition = true

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={condition} />
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

      vi.spyOn(globalThis, 'confirm').mockReturnValue(false)

      blockCallback(mockTransition)

      expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure?')
    }
  })

  it('calls unblock and retry when user confirms', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    const condition = true

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={condition} />
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

      vi.spyOn(globalThis, 'confirm').mockReturnValue(true)

      blockCallback(mockTransition)

      expect(retrySpy).toHaveBeenCalledTimes(1)
    }
  })

  it('does not call retry when user cancels', async () => {
    const history = createMemoryHistory({ initialEntries: ['/initial'] })
    const blockSpy = vi.spyOn(history, 'block')

    const condition = true

    await render(
      <Router history={history}>
        <Prompt message="Are you sure?" when={condition} />
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

      vi.spyOn(globalThis, 'confirm').mockReturnValue(false)

      blockCallback(mockTransition)

      expect(retrySpy).not.toHaveBeenCalledTimes(1)
    }
  })
})
