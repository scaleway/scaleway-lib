# `@scaleway/use-analytics`

## A tiny hooks to handle analytics events

## Install

```bash
$ pnpm add @scaleway/use-analytics
```

## Usage

### Event directory

Create an events directory with all you specific events.

```
events
 ┣ pageTypes
 ┃ ┗ index.ts
 ┣ 📂loginEvent
 ┃ ┗ index.ts
 ┃ index.ts ( export all you functions )

```

Each event will have a format like this:

```typescript
const pageVisited =
  (analytics?: Analytics) =>
  async (args: Args): Promise<void> => {
    // here do what you have to do with analytics
    await analytics?.page(args)
  }

export default pageVisited
```

```typescript
import pageTypes from './pageTypes'
import testEvents from './testEvents'

export default {
  pageTypes,
  testEvents,
}
```

### Context Load

Inside you global app you have to use our Analytics Provider to allow loading of analytics from your settting app.
This will trigger a load and return analitycs function inside you provider.

```javascript
import { AnalyticsProvider } from '@scaleway/use-analytics'
import { captureMessage } from '@sentry/browser'
import events from './events'

const App = () => (
  <AnalyticsProvider
    settings={{ cdn: 'https://cdn.url', writeKey: 'WRITE_KEY' }} 
    events={events}
    onError={e => captureMessage(`Error on Analytics: ${e.message}`)}
  >
    <App />
  </AnalyticsProvider>
)
```

### Hook utility

Now you maybe want to use your events inside your app .
If you are using typescript, you may

```typescript
import { useAnalytics } from '@scaleway/use-analytics'
import type { Events } from 'types/events'
import { Form, Submit } from '@scaleway/form'

const Login = () => {
  const { events } = useAnalytics<Events>()

  const onSubmit = async args => {
    // make you api calls
    await events.login()
  }

  return (
    <Form onSubmit={onSubmit}>
      // others fields
      <Submit />
    </Form>
  )
}
```
