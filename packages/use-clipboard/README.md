# `@scaleway/use-clipboard`

## Install

```bash
pnpm add @scaleway/use-clipboard
```

## Usage

### Hook

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

### Standalone function

```tsx
import { copyToClipboard } from '@scaleway/use-clipboard'

const handleCopy = async () => {
  await copyToClipboard('text to copy', {
    onError: error => {
      console.error('Copy failed:', error)
    },
  })
}
```
