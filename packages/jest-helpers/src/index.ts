import { CreateSerializerOptions, createSerializer } from '@emotion/jest'
import { FC } from 'react'
import makeRenderWithTheme, { RenderWithThemeFn } from './helpers/renderWithTheme'
import makeShouldMatchEmotionSnapshot, { ShouldMatchEmotionSnapshotFn } from './helpers/shouldMatchEmotionSnapshot'
import makeShouldMatchEmotionSnapshotWithPortal, { ShouldMatchEmotionSnapshotWithPortalFn } from './helpers/shouldMatchEmotionSnapshotWithPortal'

export { default as makeRenderWithTheme } from './helpers/renderWithTheme'

type Helpers<Theme> = {
  renderWithTheme: RenderWithThemeFn<Theme>
  shouldMatchEmotionSnapshot: ShouldMatchEmotionSnapshotFn<Theme>
  shouldMatchEmotionSnapshotWithPortal: ShouldMatchEmotionSnapshotWithPortalFn<Theme>
}

export default function makeHelpers<Theme>(Wrapper: FC<{ theme?: Theme }>, createSerializerOptions?: CreateSerializerOptions): Helpers<Theme> {
  let isInitialized = false

  const initializeIfNeeded = <T>(callback: T) => {
    if (!isInitialized) {
      isInitialized = true

      // use only class hash (generated from css style content)
      expect.addSnapshotSerializer(
        createSerializer(createSerializerOptions),
      )
    }

    return callback;
  }

  const renderWithTheme = makeRenderWithTheme(Wrapper)
  const shouldMatchEmotionSnapshot = initializeIfNeeded(makeShouldMatchEmotionSnapshot(renderWithTheme))
  const shouldMatchEmotionSnapshotWithPortal = initializeIfNeeded(makeShouldMatchEmotionSnapshotWithPortal(renderWithTheme))

  return {
    renderWithTheme,
    shouldMatchEmotionSnapshot,
    shouldMatchEmotionSnapshotWithPortal,
  }
}
