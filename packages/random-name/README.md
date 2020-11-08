# `@scaleway/random-name`

A tiny utility to generate random names

---

## Install

```bash
$ yarn add @scaleway/random-names
```

## Usage

```js
import randomName from '@scaleway/random-name'

// randomName(prefix: string = '', separator: string = '-'): string

randomName() // => "admiring-allen"
randomName('superb') // => "superb-admiring-allen"
randomName('superb', '_') // => "superb_admiring_allen"
randomName('', '_') // => "admiring_allen"
```
