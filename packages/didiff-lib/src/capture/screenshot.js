async function screenshot(
  page,
  { path, viewportHeight, screeshotHeight, viewportWidth, offset },
) {
  await page.setViewport({
    height: viewportHeight,
    width: viewportWidth,
  })

  // eslint-disable-next-line no-restricted-syntax
  for (const element of (
    process.env.REACT_APP_DIDIFF_HIDE_ELEMENTS || ''
  ).split(',')) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await page.$$eval(element, elements =>
        elements.forEach(e => e.style.setProperty('visibility', 'hidden')),
      )
    } catch (err) {
      // eslint-disable-next-line no-empty
    }
  }

  return page.screenshot({
    path,
    clip: {
      x: 0,
      y: offset,
      height: screeshotHeight,
      width: viewportWidth,
    },
  })
}

export default screenshot
