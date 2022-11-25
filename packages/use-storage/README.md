# `@scaleway/use-storage`

A React hook to interact with local/session storage in reactive way with the same API as setState

---

## Install

```bash
$ pnpm add @scaleway/use-storage
```

## Usage

With localStorage

```js
import React from 'react'
import { useLocalStorage } from '@scaleway/use-storage'

const Component = () => {
  const [value, setValue] = useLocalStorage('key')

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => setValue('test from hook')}>Click me to set value to "test from hook"</button>
      <button onClick={() => localStorage.setItem('key', 'test from window')}>Click me to set value to "test from window"</button>
    </div>
  )
}
```

With sessionStorage

```js
import React from 'react'
import { useSessionStorage } from '@scaleway/use-storage'

const Component = () => {
  const [value, setValue] = useSessionStorage('key')

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => setValue('test from hook')}>Click me to set value to "test from hook"</button>
      <button onClick={() => localStorage.setItem('key', 'test from window')}>Click me to set value to "test from window"</button>
    </div>
  )
}
```

With initialValue

```js
import React from 'react'
import { useLocalStorage } from '@scaleway/use-storage'

const Component = () => {
  const [value, setValue] = useLocalStorage('key', 'initial')

  return (
    <div>
      <span>{value}</span> // Will be "initial" of no other value is already set
      <button onClick={() => setValue('test from hook')}>Click me to set value to "test from hook"</button>
      <button onClick={() => localStorage.setItem('key', 'test from window')}>Click me to set value to "test from window"</button>
    </div>
  )
}
```
