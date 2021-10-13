# `@scaleway/jest-helpers`

## A package for utilities jest functions

## Install

```bash
$ yarn add @scaleway/jest-functions
```

## How to use

### Create the helpers functions

```tsx
import makeHelpers from '@scaleway/jest-helpers'

const Wrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

export const {
  renderWithTheme,
  shouldMatchEmotionSnapshot,
  shouldMatchEmotionSnapshotWithPortal,
} = makeHelpers(Wrapper)
```

#### With a theme prop

```tsx
import makeHelpers from '@scaleway/jest-helpers'
import defaultTheme from '..'

interface WrapperProps {
  theme?: typeof defaultTheme
}

const Wrapper = ({ theme, children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export const {
  renderWithTheme,
  shouldMatchEmotionSnapshot,
  shouldMatchEmotionSnapshotWithPortal,
} = makeHelpers(Wrapper)
```

#### With CreateSerializerOptions

```tsx
import makeHelpers from '@scaleway/jest-helpers'

const Wrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

export const {
  renderWithTheme,
  shouldMatchEmotionSnapshot,
  shouldMatchEmotionSnapshotWithPortal,
} = makeHelpers(Wrapper, { classNameReplacer: className => className })
```

### renderWithTheme

Automatically uses `CacheProvider` from `@emotion/cache`. Use it with a component, optional options & optional theme.

```tsx
const renderWithTheme = (
  component: ReactNode,
  options?: RenderOptions,
  theme?: Theme,
) => ReturnType<typeof render>
```

### shouldMatchEmotionSnapshot / shouldMatchEmotionSnapshotWithPortal

Internally it uses the `renderWithTheme` generated from above.

```tsx
const shouldMatchEmotionSnapshot = (
  component: ReactNode,
  options: {
    options?: RenderOptions
    transform?: (node: ReturnType<typeof render>) => Promise<void> | void
    theme?: Theme
  },
) => Promise<void>
```
