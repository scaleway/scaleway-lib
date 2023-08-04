# `@scaleway/jest-helpers`

## A package for utilities jest functions

## Install

```bash
$ pnpm add @scaleway/jest-functions
```

## How to use

### Create the helpers functions

```tsx
import makeHelpers from '@scaleway/jest-helpers'

const Wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>

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

const Wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>

export const {
  renderWithTheme,
  shouldMatchEmotionSnapshot,
  shouldMatchEmotionSnapshotWithPortal,
} = makeHelpers(Wrapper, { classNameReplacer: className => className })
```

### `renderWithTheme`

Automatically uses `CacheProvider` from `@emotion/cache`. Use it with a component, optional options & optional theme.

```tsx
const renderWithTheme = (
  component: ReactNode, // The component to render
  options?: RenderOptions, // RenderOptions from @testing-library/react
  theme?: Theme, // Optional theme to use which will be passed to the Wrapper above
) => ReturnType<typeof render>
```

### `shouldMatchEmotionSnapshot` / `shouldMatchEmotionSnapshotWithPortal`

Internally it uses the `renderWithTheme` generated from above.

```tsx
const shouldMatchEmotionSnapshot = (
  component: ReactNode, // The component to render
  options: {
    // In an object to make it backward-compatible and don't introduce any API breaking changes
    options?: RenderOptions // RenderOptions from @testing-library/react
    transform?: (node: ReturnType<typeof render>) => Promise<void> | void // (a)sync function execute between the render and the expect. You can use this if you need mockAllIsIntersecting
    theme?: Theme // Optional theme to use which will be passed to the Wrapper above
  },
) => Promise<void>
```
