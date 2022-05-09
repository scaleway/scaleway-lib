# `@scaleway/use-media`

## A small hook to track CSS media query state

This library has been forked from [use-media](https://github.com/streamich/use-media), many thanks to the original author, [Vadim Dalecky](https://github.com/streamich).

## Install

```bash
$ pnpm add @scaleway/use-media
```

## Usage

### With `useEffect`

```tsx
import { useMedia } from '@scaleway/use-media'

const App = () => {
  // Accepts an object of features to test
  const isWide = useMedia({ minWidth: '1000px' });
  // Or a regular media query string
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)');

  return (
    <div>
      Screen is wide: {isWide ? '😃' : '😢'}
    </div>
  );
}
```

### With `useLayoutEffect`

```tsx
import { useMediaLayout } from '@scaleway/use-media'

const App = () => {
  // Accepts an object of features to test
  const isWide = useMediaLayout({ minWidth: '1000px' });
  // Or a regular media query string
  const reduceMotion = useMediaLayout('(prefers-reduced-motion: reduce)');

  return (
    <div>
      Screen is wide: {isWide ? '😃' : '😢'}
    </div>
  );
}
```
