import { describe, expect, it } from 'vitest'
import * as consts from '../constants'

describe('constants', () => {
  it.each(Object.entries(consts))('%s', (_, args) => {
    expect(args).toMatchSnapshot()
  })
})
