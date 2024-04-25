import { expect, jest } from '@jest/globals'
import type { RenderOptions, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { RenderWithThemeFn } from './renderWithTheme'

type Options<Theme> = {
  options?: RenderOptions
  transform?: (node: ReturnType<typeof render>) => Promise<void> | void
  theme?: Theme
}

export type ShouldMatchEmotionSnapshotWithPortalFn<Theme> = (
  component: ReactNode,
  options?: Options<Theme>,
) => Promise<void>

export default function makeShouldMatchEmotionSnapshotWithPortal<Theme>(
  renderWithTheme: RenderWithThemeFn<Theme>,
): ShouldMatchEmotionSnapshotWithPortalFn<Theme> {
  return async (component, { options, transform, theme } = {}) => {
    // Save the instance of console (disable warning about adding element directly to document.body which is necessary when testing portal components)
    const { console } = global
    global.console = { ...console, error: jest.fn() }

    const node = renderWithTheme(
      component,
      {
        container: document.body,
        ...options,
      },
      theme,
    )
    if (transform) await transform(node)
    expect(node.asFragment()).toMatchSnapshot()

    // Unmounting to don't see the warning message described above
    node.unmount()
    global.console = console
  }
}
