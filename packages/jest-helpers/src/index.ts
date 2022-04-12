import { CreateSerializerOptions, createSerializer } from '@emotion/jest'
import { FC, ReactNode } from 'react'
import makeRenderWithTheme, {
  RenderWithThemeFn,
} from './helpers/renderWithTheme'
import makeShouldMatchEmotionSnapshot, {
  ShouldMatchEmotionSnapshotFn,
} from './helpers/shouldMatchEmotionSnapshot'
import makeShouldMatchEmotionSnapshotWithPortal, {
  ShouldMatchEmotionSnapshotWithPortalFn,
} from './helpers/shouldMatchEmotionSnapshotWithPortal'

export { default as makeRenderWithTheme } from './helpers/renderWithTheme'

type Helpers<Theme> = {
  renderWithTheme: RenderWithThemeFn<Theme>
  shouldMatchEmotionSnapshot: ShouldMatchEmotionSnapshotFn<Theme>
  shouldMatchEmotionSnapshotWithPortal: ShouldMatchEmotionSnapshotWithPortalFn<Theme>
}

export default function makeHelpers<Theme>(
  Wrapper: FC<{ theme?: Theme; children: ReactNode }>,
  createSerializerOptions?: CreateSerializerOptions,
): Helpers<Theme> {
  expect.addSnapshotSerializer(createSerializer(createSerializerOptions))

  const renderWithTheme = makeRenderWithTheme(Wrapper)
  const shouldMatchEmotionSnapshot =
    makeShouldMatchEmotionSnapshot(renderWithTheme)
  const shouldMatchEmotionSnapshotWithPortal =
    makeShouldMatchEmotionSnapshotWithPortal(renderWithTheme)

  return {
    renderWithTheme,
    shouldMatchEmotionSnapshot,
    shouldMatchEmotionSnapshotWithPortal,
  }
}
