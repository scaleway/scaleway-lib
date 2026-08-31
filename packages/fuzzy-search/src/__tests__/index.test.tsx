import { describe, expect, it } from 'vitest'
import { isFuzzyMatch, levenshteinDistance, normalizeString } from '..'

describe('fuzzySearch', () => {
  describe('normalizeString', () => {
    it('returns correct string', () => {
      expect(normalizeString('île-de-France')).toBe('ile de france')
    })
  })

  describe('levenshteinDistance', () => {
    it('returns correct lenvenshtein distance', () => {
      expect(levenshteinDistance('test', 'test')).toBe(0)

      expect(levenshteinDistance('tests', 'test')).toBe(1)
      expect(levenshteinDistance('test', 'tests')).toBe(1)

      expect(levenshteinDistance('tset', 'test')).toBe(2)

      expect(levenshteinDistance('hello', 'test')).toBe(4)

      expect(levenshteinDistance('', 'test')).toBe(4)
      expect(levenshteinDistance('test', '0')).toBe(4)
    })
  })
  describe('fuzzySearch', () => {
    it('with default distance (1)', () => {
      expect(isFuzzyMatch('test', 'test')).toBe(true)
      expect(isFuzzyMatch('tests', 'test')).toBe(false)
      expect(isFuzzyMatch('test', 'tests')).toBe(true)
      expect(isFuzzyMatch('tset', 'test')).toBe(false)
      expect(isFuzzyMatch('hello', 'test')).toBe(false)
      expect(isFuzzyMatch('', 'test')).toBe(true)
    })

    it('with distance = 0 (exact match)', () => {
      expect(isFuzzyMatch('test', 'test', 0)).toBe(true)
      expect(isFuzzyMatch('tests', 'test', 0)).toBe(false)
      expect(isFuzzyMatch('test', 'tests', 0)).toBe(true)
      expect(isFuzzyMatch('tset', 'test', 0)).toBe(false)
      expect(isFuzzyMatch('hello', 'test', 0)).toBe(false)
      expect(isFuzzyMatch('', 'test')).toBe(true)
    })

    it('with distance = 2 (swap tolerant)', () => {
      expect(isFuzzyMatch('test', 'test', 2)).toBe(true)
      expect(isFuzzyMatch('tests', 'test', 2)).toBe(false)
      expect(isFuzzyMatch('test', 'tests', 2)).toBe(true)
      expect(isFuzzyMatch('tset', 'test', 2)).toBe(true)
      expect(isFuzzyMatch('hello', 'test', 2)).toBe(false)
      expect(isFuzzyMatch('', 'test')).toBe(true)
    })
  })
})
