# `@scaleway/use-segment`

## A tiny hooks to handle segment events

use [@segment/analytics-next](https://github.com/segmentio/analytics-next)

## Install

```bash
$ pnpm add @scaleway/use-segment
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

Inside you global app you have to use our Segment Provider to allow loading of segment from your settting app.
This will trigger a load and return analitycs function inside you provider.

```javascript
import SegmentProvider from '@scaleway/use-segment'
import { captureMessage } from '@sentry/browser'
import events from './events'

const App = () => (
  <SegmentProvider
    settings={{ cdn: 'https://cdn.url', writeKey: 'WRITE_KEY' }} // check your gtm writeKey
    events={events}
    onError={e => captureMessage(`Error on Segment: ${e.message}`)}
  >
    <App />
  </SegmentProvider>
)
```

### Hook utility

Now you maybe want to use your events inside your app .
If you are using typescript, you may

```typescript
import { useSegment } from '@scaleway/use-segment'
import type { Events } from 'types/events'
import { Form, Submit } from '@scaleway/form'

const Login = () => {
  const { events } = useSegment<Events>()

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
