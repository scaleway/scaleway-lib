/* eslint-disable react-hooks/rules-of-hooks */
import { expect, test } from 'tstyche'
import { useI18n } from '../usei18n'

test('i18n - namespaceTranslation', () => {
  const { namespaceTranslation } = useI18n<{
    hello: 'world'
    'doe.john': 'John Doe'
    'doe.jane': 'Jane Doe'
    'doe.child': 'Child is {name}'
    'describe.john': '{name} is {age} years old'
  }>()

  // Single key
  expect(namespaceTranslation('hello')).type.toRaiseError(
    `Argument of type '"hello"' is not assignable to parameter of type '"doe" | "describe"'`,
  )

  // Multiple keys
  expect(namespaceTranslation('doe.john')).type.toRaiseError(
    `Argument of type '"doe.john"' is not assignable to parameter of type '"doe" | "describe"'`,
  )

  expect(namespaceTranslation('doe')('john')).type.toEqual<string>()

  expect(namespaceTranslation('doe')('doesnotexists')).type.toRaiseError(
    `Expected 2 arguments, but got 1.`,
  )

  // With a param
  expect(namespaceTranslation('doe')('child')).type.toRaiseError(
    `Expected 2 arguments, but got 1.`,
  )
  expect(
    namespaceTranslation('doe')('child', {
      name: 'Name',
    }),
  ).type.toEqual<string>()
  expect(
    namespaceTranslation('doe')('doesnotexists', {
      name: 'Name',
    }),
  ).type.toRaiseError()
  expect(
    namespaceTranslation('doe')('child', {
      doesnotexists: 'Name',
    }),
  ).type.toRaiseError()

  expect(namespaceTranslation('doe')('child', {})).type.toRaiseError()
  expect(namespaceTranslation('doe')('child')).type.toRaiseError()

  // With multiple params
  expect(
    namespaceTranslation('describe')('john', {
      age: '30',
      name: 'John',
    }),
  ).type.toEqual<string>()

  expect(namespaceTranslation('describe')('john', {})).type.toRaiseError()
  expect(namespaceTranslation('describe')('john')).type.toRaiseError()

  // Required generic
  const { namespaceTranslation: namespaceTranslation2 } = useI18n()
  expect(namespaceTranslation2('test')).type.toRaiseError(
    `Argument of type '"test"' is not assignable to parameter of type`,
  )
})
