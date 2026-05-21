# `@scaleway/use-clipboard`

## Install

```bash
$ pnpm add @scaleway/use-clipboard
```

## Usage

```tsx
import { useClipboard } from '@scaleway/use-clipboard'

const Component = () => {
  const [isCopied, setCopied] = useClipboard('test')

  return (
    <div>
      <p>isCopied: {isCopied}</p>
      <button onClick={setCopied}>Copy text</button>
    </div>
  )
}
```
