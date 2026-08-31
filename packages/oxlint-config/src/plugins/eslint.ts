// oxlint-disable max-lines
import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['eslint'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/accessor-pairs
     */
    'eslint/accessor-pairs': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/array-callback-return
     */
    'eslint/array-callback-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/arrow-body-style
     */
    'eslint/arrow-body-style': ['error', 'as-needed'],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/block-scoped-var
     */
    'eslint/block-scoped-var': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/capitalized-comments
     */
    'eslint/capitalized-comments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/class-methods-use-this
     */
    'eslint/class-methods-use-this': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/complexity
     */
    'eslint/complexity': ['error', { max: 40 }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/constructor-super
     */
    'eslint/constructor-super': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/curly
     */
    'eslint/curly': ['error', 'all'],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-case
     */
    'eslint/default-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-case-last
     */
    'eslint/default-case-last': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-param-last
     */
    'eslint/default-param-last': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/eqeqeq
     */
    'eslint/eqeqeq': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/for-direction
     */
    'eslint/for-direction': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/func-name-matching
     */
    'eslint/func-name-matching': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/func-names
     */
    'eslint/func-names': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/func-style
     */
    'eslint/func-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/getter-return
     */
    'eslint/getter-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/grouped-accessor-pairs
     */
    'eslint/grouped-accessor-pairs': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/guard-for-in
     */
    'eslint/guard-for-in': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-denylist
     */
    'eslint/id-denylist': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-length
     * @todo Needs to be reviewed
     */
    'eslint/id-length': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-match
     */
    'eslint/id-match': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/init-declarations
     */
    'eslint/init-declarations': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/logical-assignment-operators
     * @todo Needs to be reviewed
     */
    'eslint/logical-assignment-operators': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-classes-per-file
     */
    'eslint/max-classes-per-file': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-depth
     */
    'eslint/max-depth': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines
     */
    'eslint/max-lines': ['error', { max: 500 }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines-per-function
     */
    'eslint/max-lines-per-function': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-nested-callbacks
     */
    'eslint/max-nested-callbacks': ['error', { max: 4 }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-params
     */
    'eslint/max-params': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-statements
     */
    'eslint/max-statements': ['error', { max: 50 }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/new-cap
     */
    'eslint/new-cap': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-alert
     */
    'eslint/no-alert': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-array-constructor
     */
    'eslint/no-array-constructor': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-async-promise-executor
     */
    'eslint/no-async-promise-executor': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-await-in-loop
     */
    'eslint/no-await-in-loop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-bitwise
     */
    'eslint/no-bitwise': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-caller
     */
    'eslint/no-caller': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-case-declarations
     */
    'eslint/no-case-declarations': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-class-assign
     */
    'eslint/no-class-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-compare-neg-zero
     */
    'eslint/no-compare-neg-zero': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-cond-assign
     */
    'eslint/no-cond-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-console
     */
    'eslint/no-console': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-const-assign
     */
    'eslint/no-const-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-constant-binary-expression
     */
    'eslint/no-constant-binary-expression': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-constant-condition
     */
    'eslint/no-constant-condition': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-constructor-return
     */
    'eslint/no-constructor-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-continue
     */
    'eslint/no-continue': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-control-regex
     */
    'eslint/no-control-regex': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger
     */
    'eslint/no-debugger': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-delete-var
     */
    'eslint/no-delete-var': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-div-regex
     */
    'eslint/no-div-regex': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-class-members
     */
    'eslint/no-dupe-class-members': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-else-if
     */
    'eslint/no-dupe-else-if': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-keys
     */
    'eslint/no-dupe-keys': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-duplicate-case
     */
    'eslint/no-duplicate-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-duplicate-imports
     */
    'eslint/no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-else-return
     */
    'eslint/no-else-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty
     */
    'eslint/no-empty': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-character-class
     */
    'eslint/no-empty-character-class': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-function
     */
    'eslint/no-empty-function': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-pattern
     */
    'eslint/no-empty-pattern': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-static-block
     */
    'eslint/no-empty-static-block': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-eq-null
     */
    'eslint/no-eq-null': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-eval
     */
    'eslint/no-eval': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-ex-assign
     */
    'eslint/no-ex-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-extend-native
     */
    'eslint/no-extend-native': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-extra-bind
     */
    'eslint/no-extra-bind': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-extra-boolean-cast
     */
    'eslint/no-extra-boolean-cast': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-extra-label
     */
    'eslint/no-extra-label': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-fallthrough
     */
    'eslint/no-fallthrough': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-func-assign
     */
    'eslint/no-func-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-global-assign
     */
    'eslint/no-global-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-implicit-coercion
     */
    'eslint/no-implicit-coercion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-implicit-globals
     */
    'eslint/no-implicit-globals': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-implied-eval
     */
    'eslint/no-implied-eval': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-import-assign
     */
    'eslint/no-import-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-inline-comments
     */
    'eslint/no-inline-comments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-inner-declarations
     */
    'eslint/no-inner-declarations': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-invalid-regexp
     */
    'eslint/no-invalid-regexp': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-irregular-whitespace
     */
    'eslint/no-irregular-whitespace': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-iterator
     */
    'eslint/no-iterator': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-label-var
     */
    'eslint/no-label-var': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-labels
     */
    'eslint/no-labels': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-lone-blocks
     */
    'eslint/no-lone-blocks': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-lonely-if
     */
    'eslint/no-lonely-if': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-loop-func
     */
    'eslint/no-loop-func': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-loss-of-precision
     */
    'eslint/no-loss-of-precision': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-magic-numbers
     * @todo Needs to be reviewed
     */
    'eslint/no-magic-numbers': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-misleading-character-class
     */
    'eslint/no-misleading-character-class': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-multi-assign
     */
    'eslint/no-multi-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-multi-str
     */
    'eslint/no-multi-str': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-negated-condition
     */
    'eslint/no-negated-condition': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-nested-ternary
     */
    'eslint/no-nested-ternary': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-new
     */
    'eslint/no-new': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-new-func
     */
    'eslint/no-new-func': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-new-native-nonconstructor
     */
    'eslint/no-new-native-nonconstructor': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-new-wrappers
     */
    'eslint/no-new-wrappers': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-nonoctal-decimal-escape
     */
    'eslint/no-nonoctal-decimal-escape': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-obj-calls
     */
    'eslint/no-obj-calls': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-object-constructor
     */
    'eslint/no-object-constructor': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-param-reassign
     */
    'eslint/no-param-reassign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-plusplus
     */
    'eslint/no-plusplus': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-promise-executor-return
     */
    'eslint/no-promise-executor-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-proto
     */
    'eslint/no-proto': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-prototype-builtins
     */
    'eslint/no-prototype-builtins': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-redeclare
     */
    'eslint/no-redeclare': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-regex-spaces
     */
    'eslint/no-regex-spaces': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-exports
     */
    'eslint/no-restricted-exports': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-globals
     */
    'eslint/no-restricted-globals': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports
     */
    'eslint/no-restricted-imports': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-properties
     */
    'eslint/no-restricted-properties': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-return-assign
     */
    'eslint/no-return-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-script-url
     */
    'eslint/no-script-url': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-self-assign
     */
    'eslint/no-self-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-self-compare
     */
    'eslint/no-self-compare': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-sequences
     */
    'eslint/no-sequences': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-setter-return
     */
    'eslint/no-setter-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-shadow
     */
    'eslint/no-shadow': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-shadow-restricted-names
     */
    'eslint/no-shadow-restricted-names': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-sparse-arrays
     */
    'eslint/no-sparse-arrays': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-template-curly-in-string
     */
    'eslint/no-template-curly-in-string': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-ternary
     */
    'eslint/no-ternary': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-this-before-super
     */
    'eslint/no-this-before-super': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-throw-literal
     */
    'eslint/no-throw-literal': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unassigned-vars
     */
    'eslint/no-unassigned-vars': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-undef
     */
    'eslint/no-undef': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-undefined
     * @todo Needs to be reviewed
     */
    'eslint/no-undefined': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-underscore-dangle
     */
    'eslint/no-underscore-dangle': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unexpected-multiline
     */
    'eslint/no-unexpected-multiline': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unmodified-loop-condition
     */
    'eslint/no-unmodified-loop-condition': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unneeded-ternary
     */
    'eslint/no-unneeded-ternary': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unreachable
     */
    'eslint/no-unreachable': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unreachable-loop
     */
    'eslint/no-unreachable-loop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unsafe-finally
     */
    'eslint/no-unsafe-finally': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unsafe-negation
     */
    'eslint/no-unsafe-negation': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unsafe-optional-chaining
     */
    'eslint/no-unsafe-optional-chaining': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-expressions
     */
    'eslint/no-unused-expressions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-labels
     */
    'eslint/no-unused-labels': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-private-class-members
     */
    'eslint/no-unused-private-class-members': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars
     */
    'eslint/no-unused-vars': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-use-before-define
     */
    'eslint/no-use-before-define': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-assignment
     */
    'eslint/no-useless-assignment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-backreference
     */
    'eslint/no-useless-backreference': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-call
     */
    'eslint/no-useless-call': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-catch
     */
    'eslint/no-useless-catch': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-computed-key
     */
    'eslint/no-useless-computed-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-concat
     */
    'eslint/no-useless-concat': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-constructor
     */
    'eslint/no-useless-constructor': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-escape
     */
    'eslint/no-useless-escape': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-rename
     */
    'eslint/no-useless-rename': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-return
     */
    'eslint/no-useless-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-var
     */
    'eslint/no-var': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-void
     */
    'eslint/no-void': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-warning-comments
     */
    'eslint/no-warning-comments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-with
     */
    'eslint/no-with': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/object-shorthand
     */
    'eslint/object-shorthand': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/one-var
     */
    'eslint/one-var': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/operator-assignment
     */
    'eslint/operator-assignment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-arrow-callback
     */
    'eslint/prefer-arrow-callback': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-const
     */
    'eslint/prefer-const': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-destructuring
     */
    'eslint/prefer-destructuring': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-exponentiation-operator
     */
    'eslint/prefer-exponentiation-operator': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-named-capture-group
     */
    'eslint/prefer-named-capture-group': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-numeric-literals
     */
    'eslint/prefer-numeric-literals': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-object-has-own
     */
    'eslint/prefer-object-has-own': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-object-spread
     */
    'eslint/prefer-object-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-promise-reject-errors
     */
    'eslint/prefer-promise-reject-errors': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-regex-literals
     */
    'eslint/prefer-regex-literals': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-rest-params
     */
    'eslint/prefer-rest-params': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-spread
     */
    'eslint/prefer-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-template
     */
    'eslint/prefer-template': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/preserve-caught-error
     */
    'eslint/preserve-caught-error': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/radix
     */
    'eslint/radix': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-await
     */
    'eslint/require-await': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-unicode-regexp
     */
    'eslint/require-unicode-regexp': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-yield
     */
    'eslint/require-yield': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-imports
     * @note declaration ordering is handled by oxfmt. Here we only sort imports members
     * ignoreCase is set to true to be consistent with oxfmt
     */
    'eslint/sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-keys
     */
    'eslint/sort-keys': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-vars
     */
    'eslint/sort-vars': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/symbol-description
     */
    'eslint/symbol-description': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/unicode-bom
     */
    'eslint/unicode-bom': ['error', 'never'],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/use-isnan
     */
    'eslint/use-isnan': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/valid-typeof
     */
    'eslint/valid-typeof': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/vars-on-top
     */
    'eslint/vars-on-top': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/yoda
     */
    'eslint/yoda': 'error',
  },
})
