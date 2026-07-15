# `@scaleway/use-interval`

Based on <https://overreacted.io/making-setinterval-declarative-with-react-hooks/>

---

## Install

```bash
pnpm add @scaleway/use-interval
```

## Usage

```js
import React from 'react'
import { useInterval } from '@scaleway/use-interval'

const Component = () => {
  const [count, setCount] = useState(0)

  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  return <h1>{count}</h1>
}
```
