// oxlint-disable vitest/prefer-expect-assertions typescript/no-unsafe-argument typescript/no-unsafe-type-assertion typescript/no-explicit-any
import { describe, expect, it } from 'vitest'
import { isModifiedEvent } from '../isModifiedEvent'

describe('isModifiedEvent', () => {
  it('returns false for regular click', () => {
    const event = {
      button: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }

    expect(isModifiedEvent(event as any)).toBe(false)
  })

  it('returns true for ctrl key', () => {
    const event = {
      button: 0,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }

    expect(isModifiedEvent(event as any)).toBe(true)
  })

  it('returns true for shift key', () => {
    const event = {
      button: 0,
      ctrlKey: false,
      shiftKey: true,
      altKey: false,
      metaKey: false,
    }

    expect(isModifiedEvent(event as any)).toBe(true)
  })

  it('returns true for alt key', () => {
    const event = {
      button: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: true,
      metaKey: false,
    }

    expect(isModifiedEvent(event as any)).toBe(true)
  })

  it('returns true for meta key', () => {
    const event = {
      button: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: true,
    }

    expect(isModifiedEvent(event as any)).toBe(true)
  })

  it('returns false for left click without modifiers', () => {
    const event = {
      button: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }

    expect(isModifiedEvent(event as any)).toBe(false)
  })
})
