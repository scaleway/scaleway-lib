import { describe, expectTypeOf, it } from 'vitest'
import type { BaseLocale, LocaleKeys, LocaleValue, Params, Scopes } from '../international-types'

describe('i18n - vendored international-types', () => {
  it('should not strip plural suffixes from locale keys', () => {
    type Locale = { 'apples#other': '{count} apples' }

    expectTypeOf<LocaleKeys<Locale, undefined>>().toEqualTypeOf<'apples#other'>()
  })

  it('should extract params from CLDR category plurals', () => {
    type Plural = '{n, plural, one {photo} other {photos}}'

    expectTypeOf<Params<Plural>>().toEqualTypeOf<['n']>()
  })

  it('should extract params from numeric plurals with nested braces', () => {
    type Plural = '{count, plural, =0 {No file} =1 {{count} file} other {{count} files}}'

    expectTypeOf<Params<Plural>>().toEqualTypeOf<['count', 'count', 'count']>()
  })

  it('should extract no params from plain and empty messages', () => {
    expectTypeOf<Params<'plain message'>>().toEqualTypeOf<[]>()
    expectTypeOf<Params<''>>().toEqualTypeOf<[]>()
  })

  it('should extract params from simple interpolations', () => {
    type Message = 'hello {name} you are {age}'

    expectTypeOf<Params<Message>>().toEqualTypeOf<['name', 'age']>()
  })

  it('should extract params from two-branch numeric plurals', () => {
    type Plural = '{count, plural, =0 {none} other {some}}'

    expectTypeOf<Params<Plural>>().toEqualTypeOf<['count']>()
  })

  it('should extract params from numeric plurals with pound selectors', () => {
    type Plural = '{numPhotos, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}'

    expectTypeOf<Params<Plural>>().toEqualTypeOf<['numPhotos']>()
  })

  it('should extract params from three-branch CLDR category plurals', () => {
    type Plural = '{count, plural, zero {no items} one {item} other {items}}'

    expectTypeOf<Params<Plural>>().toEqualTypeOf<['count']>()
  })

  it('should extract params inside plural branches', () => {
    type Plural = '{count, plural, =0 {nothing} other {{count} items for {user}}}'

    expectTypeOf<Params<Plural>>().toEqualTypeOf<['count', 'count', 'user']>()
  })

  it('should derive scopes from dotted locale keys', () => {
    type Locale = {
      'lvl1.key2': 'value'
      'lvl1.lvl2.key1': 'value'
    }

    expectTypeOf<Scopes<Locale>>().toEqualTypeOf<'lvl1' | 'lvl1.lvl2'>()
  })

  it('should list all keys when unscoped', () => {
    type Locale = { 'a.one': 'value'; 'b.two': 'value'; three: 'value' }

    expectTypeOf<LocaleKeys<Locale, undefined>>().toEqualTypeOf<'a.one' | 'b.two' | 'three'>()
  })

  it('should strip the scope prefix and keep nested paths in scoped keys', () => {
    type Locale = {
      'lvl1.key2': 'value'
      'lvl1.lvl2.key1': 'value'
      'other.key3': 'value'
    }

    expectTypeOf<LocaleKeys<Locale, 'lvl1'>>().toEqualTypeOf<'key2' | 'lvl2.key1'>()
  })

  it('should not strip plural suffixes from scoped keys', () => {
    type Locale = { 'lvl1.items#other': '{count} items' }

    expectTypeOf<LocaleKeys<Locale, 'lvl1'>>().toEqualTypeOf<'items#other'>()
  })

  it('should keep the exported base types stable', () => {
    expectTypeOf<LocaleValue>().toEqualTypeOf<string | number | boolean | null | undefined | Date>()
    expectTypeOf<BaseLocale>().toEqualTypeOf<Record<string, LocaleValue>>()
  })
})
