import type { CreateSerializerOptions } from '@emotion/jest'
import { createSerializer } from '@emotion/jest'
import { expect } from '@jest/globals'
import type { FC, ReactNode } from 'react'
import type { RenderWithThemeFn } from './helpers/renderWithTheme'
import makeRenderWithTheme from './helpers/renderWithTheme'
import type { ShouldMatchEmotionSnapshotFn } from './helpers/shouldMatchEmotionSnapshot'
import makeShouldMatchEmotionSnapshot from './helpers/shouldMatchEmotionSnapshot'
import type { ShouldMatchEmotionSnapshotWithPortalFn } from './helpers/shouldMatchEmotionSnapshotWithPortal'
import makeShouldMatchEmotionSnapshotWithPortal from './helpers/shouldMatchEmotionSnapshotWithPortal'

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
