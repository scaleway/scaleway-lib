import { fireEvent, renderHook } from '@testing-library/react'
import mockdate from 'mockdate'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SendGTM } from '..'
import GTMProvider, { useGTM } from '..'
import type { GTMProviderProps } from '../useGTM'

const defaultEvents = {
  sampleEvent: (sendGTM?: SendGTM) => (extraValue: string) => {
    sendGTM?.({
      event: 'sampleEvent',
      extra: extraValue,
    })
  },
}

type DefaultEvents = typeof defaultEvents

const wrapper =
  ({
    id,
    events,
    environment,
    onLoadError,
  }: Omit<GTMProviderProps<DefaultEvents>, 'children'>) =>
  ({ children }: { children: ReactNode }) => (
    <GTMProvider
      environment={environment}
      events={events}
      id={id}
      onLoadError={onLoadError}
    >
      {children}
    </GTMProvider>
  )

describe('GTM hook', () => {
  beforeEach(() => {
    mockdate.set('4/13/2021')
  })

  afterEach(() => {
    mockdate.reset()
    document.head.innerHTML = ''
    window.dataLayer = undefined
    vi.restoreAllMocks()
  })

  it('useGTM should not be defined without GTMProvider', () => {
    const orignalConsoleError = console.error
    console.error = vi.fn

    try {
      renderHook(() => useGTM())
    } catch (error) {
      expect((error as Error).message).toBe(
        'useGTM must be used within a GTMProvider',
      )
    }

    console.error = orignalConsoleError
  })

  it('Provider should call onLoadError if script fail to load', () => {
    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        id: 'testId',
      }),
    })

    expect(document.head.innerHTML).toMatchSnapshot()
  })

  it('Provider should not load when no id is provided', () => {
    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({}),
    })

    expect(document.head.innerHTML).toMatchSnapshot()
  })

  it('Provider should load when id is provided', () => {
    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        id: 'testId',
      }),
    })

    expect(document.head.innerHTML).toMatchSnapshot()
  })

  it('Provider should load when id and environment is provided', () => {
    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        environment: {
          auth: 'gtm',
          preview: 'world',
        },
        id: 'testId',
      }),
    })

    expect(document.head.innerHTML).toMatchSnapshot()
  })

  it('Provider should load env when environment auth is missing', () => {
    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        // @ts-expect-error we test a failing case
        environment: {
          preview: 'world',
        },
        id: 'testId',
      }),
    })

    expect(document.head.innerHTML).toMatchSnapshot()
  })

  it('Provider should load with events when provided', () => {
    const { result } = renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        id: 'testId',
      }),
    })

    expect(result.current.events.sampleEvent('test')).toBe(undefined)
    expect(window.dataLayer).toMatchSnapshot()
    // @ts-expect-error if type infering works this should be an error
    expect(result.current.events.sampleEvent()).toBe(undefined)
  })

  it('Provider should load onLoadError when script fail to load', () => {
    const onLoadError = vi.fn()

    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        id: 'testId',
        onLoadError,
      }),
    })

    const script = document.querySelector(
      `script[src="https://www.googletagmanager.com/gtm.js?id=testId"]`,
    ) as Element
    fireEvent.error(script)
    expect(onLoadError).toHaveBeenCalledOnce()
  })
})
