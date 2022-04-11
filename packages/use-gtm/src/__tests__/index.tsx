import { fireEvent } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ReactNode } from 'react'
import GTMProvider, { SendGTM, useGTM } from '..'
import { GTMProviderProps } from '../useGTM'

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
  ({ children }: { children: ReactNode }) =>
    (
      <GTMProvider
        id={id}
        events={events}
        environment={environment}
        onLoadError={onLoadError}
      >
        {children}
      </GTMProvider>
    )

describe('GTM hook', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    window.dataLayer = undefined
    jest.restoreAllMocks()
  })

  it('useGTM should not be defined without GTMProvider', () => {
    const { result } = renderHook(() => useGTM())
    expect(() => {
      expect(result.current).toBe(undefined)
    }).toThrow(Error('useGTM must be used within a GTMProvider'))
  })

  it('Provider should call onLoadError if script fail to load', () => {
    renderHook(() => useGTM<DefaultEvents>(), {
      wrapper: wrapper({
        id: 'testId',
      }),
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
    const onLoadError = jest.fn()

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
    expect(onLoadError).toHaveBeenCalledTimes(1)
  })
})
