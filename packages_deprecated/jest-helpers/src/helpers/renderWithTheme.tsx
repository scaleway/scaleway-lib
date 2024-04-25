import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import type { FC, ReactNode } from 'react'

const emotionCache = createCache({
  key: 'cache',
})

emotionCache.compat = true

export type RenderWithThemeFn<Theme> = (
  component: ReactNode,
  options?: RenderOptions,
  theme?: Theme,
) => ReturnType<typeof render>

export default function makeRenderWithTheme<Theme>(
  Wrapper: FC<{ theme?: Theme; children: ReactNode }>,
): RenderWithThemeFn<Theme> {
  return (component, options, theme) =>
    render(
      <CacheProvider value={emotionCache}>
        <Wrapper theme={theme}>{component}</Wrapper>
      </CacheProvider>,
      options,
    )
}
