import { beforeAll, describe, expect, it, jest, test } from '@jest/globals'
import makeHelpers from '..'
import type { RenderWithThemeFn } from '../helpers/renderWithTheme'
import type { ShouldMatchEmotionSnapshotFn } from '../helpers/shouldMatchEmotionSnapshot'
import type { ShouldMatchEmotionSnapshotWithPortalFn } from '../helpers/shouldMatchEmotionSnapshotWithPortal'

describe('@jest-helpers', () => {
  let renderWithTheme: RenderWithThemeFn<unknown>
  let shouldMatchEmotionSnapshot: ShouldMatchEmotionSnapshotFn<unknown>
  let shouldMatchEmotionSnapshotWithPortal: ShouldMatchEmotionSnapshotWithPortalFn<unknown>

  beforeAll(() => {
    const helpers = makeHelpers(({ children }) => (
      <div id="wrapper">{children}</div>
    ))

    renderWithTheme = helpers.renderWithTheme
    shouldMatchEmotionSnapshot = helpers.shouldMatchEmotionSnapshot
    shouldMatchEmotionSnapshotWithPortal =
      helpers.shouldMatchEmotionSnapshotWithPortal
  })

  test('should render with renderWithTheme', () => {
    const node = renderWithTheme(<div data-testid="test" />)
    const element = node.getByTestId('test')

    expect(element).toMatchSnapshot()
  })

  test('should render with shouldMatchEmotionSnapshot', async () => {
    await shouldMatchEmotionSnapshot(<div id="test" />)
  })

  test('should call tranform with shouldMatchEmotionSnapshot', async () => {
    const transform = jest.fn()
    await shouldMatchEmotionSnapshot(<div id="test" />, { transform })

    expect(transform).toHaveBeenCalledTimes(1)
  })

  test('should render with shouldMatchEmotionSnapshotWithPortal', async () => {
    await shouldMatchEmotionSnapshotWithPortal(<div id="test" />)
  })

  it('should call transform with shouldMatchEmotionSnapshot', async () => {
    const transform = jest.fn()
    await shouldMatchEmotionSnapshotWithPortal(<div id="test" />, { transform })

    expect(transform).toHaveBeenCalledTimes(1)
  })
})
