import { expect, test } from 'tstyche'
import { useI18n } from '../usei18n'

const { t } = useI18n<{
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}>()

test('i18n - t', () => {
  expect(t('hello')).type.toBe<string>()
  // Single key
  expect(t('keydoesnotexists')).type.toRaiseError()

  // Multiple keys
  expect(t('doe.john')).type.toBe<string>()
  expect(t('doe.doesnotexists')).type.toRaiseError()

  // With a param
  expect(
    t('doe.child', {
      name: 'Name',
    }),
  ).type.toBe<string>()
  expect(
    t('doe.doesnotexists', {
      name: 'Name',
    }),
  ).type.toRaiseError()

  expect(t('doe.child', {})).type.toRaiseError(
    "Argument of type '{}' is not assignable to parameter of type",
  )

  expect(t('doe.child')).type.toRaiseError('Expected 2 arguments, but got 1')

  // With multiple params
  expect(
    t('describe.john', {
      age: '30',
      name: 'John',
    }),
  ).type.toBe<string>()

  expect(t('describe.john', {})).type.toRaiseError()
  expect(t('describe.john')).type.toRaiseError()

  // With react components as param value
  expect(
    t('doe.child', {
      name: (
        <p>
          My name is<b>John</b>
        </p>
      ),
    }),
  ).type.toBe<string>()

  // Required generic
  const { t: t2 } = useI18n()
  expect(t2('test')).type.toRaiseError()
})
