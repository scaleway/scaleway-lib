import { describe, expect, it } from 'vitest'
import * as constants from '../constants'

describe('constants', () => {
  it.each(Object.entries(constants))('%s', (_, args) => {
    expect(args).toMatchSnapshot()
  })
})
