/* eslint-disable react-hooks/rules-of-hooks */
import { expectError, expectType } from 'tsd-lite'
import { useI18n, useTranslation } from '../usei18n'

const { t } = useI18n<{
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}>()

// Single key
expectType<string>(t('hello'))
expectError(t('keydoesnotexists'))

// Multiple keys
expectType<string>(t('doe.john'))
expectError(t('doe.doesnotexists'))

// With a param
expectError(t('doe.child'))
expectType<string>(
  t('doe.child', {
    name: 'Name',
  }),
)
expectError(
  t('doe.doesnotexists', {
    name: 'Name',
  }),
)
expectError(
  t('doe.child', {
    doesnotexists: 'Name',
  }),
)
expectError(t('doe.child', {}))
expectError(t('doe.child'))

// With multiple params
expectType<string>(
  t('describe.john', {
    age: '30',
    name: 'John',
  }),
)
expectError(t('describe.john', {}))
expectError(t('describe.john'))

// With react components as param value
expectType<string>(
  t('doe.child', {
    name: (
      <p>
        My name is<b>John</b>
      </p>
    ),
  }),
)

// Required generic
const { t: t2 } = useI18n()
expectError(t2('test'))
