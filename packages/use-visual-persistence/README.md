# `@scaleway/use-visual-persistence`

A react hook to save element dismissal locally

---

## Install

```bash
pnpm add @scaleway/use-visual-persistence
```

## Usage

```js
import React from 'react'
import { useVisualPersistence } from '@scaleway/use-visual-persistence'

const Component = () => {
  const { hide, isHidden } = useVisualPersistence('locality-selection-popover')

  return isHidden ? null : (
    <div>
      Check out this new feature once
      <button onClick={() => hide()}>X</button>
    </div>
}
```
