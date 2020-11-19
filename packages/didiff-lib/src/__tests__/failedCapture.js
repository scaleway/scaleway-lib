/* eslint-disable no-console */

// This test is in another file because we use the mock of lookpath

import capturesPages from '../capture'

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

// Comment these two lines if you want to have logs during the tests
jest.spyOn(console, 'info').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('capture', () => {
  it.only('should not detect vips on system and exit', async () => {
    await capturesPages({
      original: {},
      sample: {},
    })

    expect(mockExit).toHaveBeenCalledWith(1)
  })
})

afterEach(() => {
  jest.clearAllMocks()
})
