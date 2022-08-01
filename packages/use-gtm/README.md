# `@scaleway/use-gtm`

## A tiny provider to handle Google Tag Manager in React

## Install

```bash
$ pnpm add @scaleway/use-gtm
```

## Usage

### Basic

```tsx
import GTMProvider, { useGTM } from '@scaleway/use-gtm'

const Page = () => {
  const { sendGTM } = useGTM()

  sendGTM?.({
    hello: 'world
  })

  return <p>Hello World</p>
}

const App = () => (
  <GTMProvider id="testId">
    <Page />
  </GTMProvider>
)
```

### With injected events

```tsx
import GTMProvider, { useGTM } from '@scaleway/use-gtm'

const events = {
  sampleEvent: (sendGTM?: SendGTM) => (message: string) => {
    sendGTM?.({
      event: 'sampleEvent',
      hello: message,
    })
  },
}

const Page = () => {
  const { events } = useGTM()

  events.sampleEvent?.('world')

  return <p>Hello World</p>
}

const App = () => (
  <GTMProvider id="testId">
    <Page />
  </GTMProvider>
)
```

### With global setter

```tsx
import GTMProvider, { sendGTM } from '@scaleway/use-gtm'

const Page = () => {
  sendGTM?.({
    hello: 'world
  })

  return <p>Hello World</p>
}

const App = () => (
  <GTMProvider id="testId">
    <Page />
  </GTMProvider>
)
```
