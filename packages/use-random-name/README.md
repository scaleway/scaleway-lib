# `@scaleway/random-name`

A tiny utility to generate random names

Fully inspired by [Moby name generator](https://github.com/moby/moby/blob/master/pkg/namesgenerator/names-generator.go)

---

## Install

```bash
$ pnpm add @scaleway/use-random-name
```

## Usage

As a React hook

```js
import React from 'react'
import useRandomName from '@scaleway/random-name'

const Component = () => {
  const name = useRandomName()

  return <span>{name}</span>
}
```

You can also access the underlying @scaleway/random-name package with a named export

```js
import { randomName } from '@scaleway/use-random-name'

// randomName(prefix: string = '', separator: string = '-'): string

randomName() // => "admiring-allen"
randomName('superb') // => "superb-admiring-allen"
randomName('superb', '_') // => "superb_admiring_allen"
randomName('', '_') // => "admiring_allen"
```
