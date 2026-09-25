# `@scaleway/srn`

Parse Scaleway Resource Names (SRN) in Node and the browser.

> **Note:** This is a v0 package, not actively maintained. It exposes syntactic
> parsing only (no platform/resource validation against Scaleway internals).

A SRN is shaped as:

```
srn://block.scw.eu/zones/it-mil-1/snapshots/22222222-3333-4444-5555-666666666666
       ^     ^      ^              ^
     product |      locality       resourcePath
       platformDomain
```

---

## Install

```bash
pnpm add @scaleway/srn
```

## Usage

```js
import { parseSRN } from '@scaleway/srn'

const srn = parseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222')
// srn.product            // 'block'
// srn.platformDomain     // 'scw.eu'
// srn.locality.name      // 'it-mil-1'
// srn.locality.type      // 'zone'
// srn.resourcePath       // 'snapshots/22222222'
// srn.resourceIdentifier.name  // 'snapshots'
// srn.resourceIdentifier.value // '22222222'
```
