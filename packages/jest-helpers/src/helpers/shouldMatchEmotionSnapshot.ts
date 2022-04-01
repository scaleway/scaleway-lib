import { RenderOptions, render } from '@testing-library/react'
import { ReactNode } from 'react'
import { RenderWithThemeFn } from './renderWithTheme'

interface Options<Theme> {
  options?: RenderOptions
  transform?: (node: ReturnType<typeof render>) => Promise<void> | void
  theme?: Theme
}

export type ShouldMatchEmotionSnapshotFn<Theme> = (
  component: ReactNode,
  options?: Options<Theme>,
) => Promise<void>

export default function makeShouldMatchEmotionSnapshot<Theme>(
  renderWithTheme: RenderWithThemeFn<Theme>,
): ShouldMatchEmotionSnapshotFn<Theme> {
  return async (component, { options, transform, theme } = {}) => {
    const node = renderWithTheme(component, options, theme)
    if (transform) await transform(node)

    expect(node.asFragment()).toMatchSnapshot()
    node.unmount()
  }
}
