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
     * No consensus as of yet
     */
    'eslint/arrow-body-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/block-scoped-var
     * No consensus as of yet
     */
    'eslint/block-scoped-var': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/capitalized-comments
     */
    'eslint/capitalized-comments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/class-methods-use-this
     * No consensus as of yet
     */
    'eslint/class-methods-use-this': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/complexity
     * No consensus as of yet
     */
    'eslint/complexity': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/constructor-super
     */
    'eslint/constructor-super': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/curly
     * No consensus as of yet
     */
    'eslint/curly': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-case
     * No consensus as of yet
     */
    'eslint/default-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-case-last
     */
    'eslint/default-case-last': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-param-last
     * No consensus as of yet
     */
    'eslint/default-param-last': 'off',
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
     * No consensus as of yet
     */
    'eslint/func-names': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/func-style
     * No consensus as of yet
     */
    'eslint/func-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/getter-return
     */
    'eslint/getter-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/grouped-accessor-pairs
     * No consensus as of yet
     */
    'eslint/grouped-accessor-pairs': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/guard-for-in
     * No consensus as of yet
     */
    'eslint/guard-for-in': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-denylist
     * No consensus as of yet
     */
    'eslint/id-denylist': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-length
     * No consensus as of yet
     */
    'eslint/id-length': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-match
     * No consensus as of yet
     */
    'eslint/id-match': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/init-declarations
     * No consensus as of yet
     */
    'eslint/init-declarations': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/logical-assignment-operators
     * No consensus as of yet
     */
    'eslint/logical-assignment-operators': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-classes-per-file
     */
    'eslint/max-classes-per-file': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-depth
     * No consensus as of yet
     */
    'eslint/max-depth': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines
     * No consensus as of yet
     */
    'eslint/max-lines': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines-per-function
     */
    'eslint/max-lines-per-function': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-nested-callbacks
     * No consensus as of yet
     */
    'eslint/max-nested-callbacks': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-params
     * No consensus as of yet
     */
    'eslint/max-params': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-statements
     * No consensus as of yet
     */
    'eslint/max-statements': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/new-cap
     * No consensus as of yet
     */
    'eslint/new-cap': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-await-in-loop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-bitwise
     * No consensus as of yet
     */
    'eslint/no-bitwise': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-caller
     */
    'eslint/no-caller': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-case-declarations
     * No consensus as of yet
     */
    'eslint/no-case-declarations': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-class-assign
     * No consensus as of yet
     */
    'eslint/no-class-assign': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-constructor-return': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-duplicate-imports': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-empty-function': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-eq-null': 'off',
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
    'eslint/no-extra-label': 'warn',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-fallthrough
     * No consensus as of yet
     */
    'eslint/no-fallthrough': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-implicit-coercion': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-implicit-globals
     */
    'eslint/no-implicit-globals': 'warn',
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
     * No consensus as of yet
     */
    'eslint/no-inline-comments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-inner-declarations
     * No consensus as of yet
     */
    'eslint/no-inner-declarations': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-label-var': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-labels
     * No consensus as of yet
     */
    'eslint/no-labels': 'off',
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
     */
    'eslint/no-magic-numbers': ['warn', { ignoreDefaultValues: true, ignoreArrayIndexes: true  }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-misleading-character-class
     */
    'eslint/no-misleading-character-class': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-multi-assign
     */
    'eslint/no-multi-assign': 'warn',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-multi-str
     * No consensus as of yet
     */
    'eslint/no-multi-str': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-negated-condition
     * No consensus as of yet
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
     * No consensus as of yet
     */
    'eslint/no-plusplus': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-promise-executor-return
     */
    'eslint/no-promise-executor-return': 'warn',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-proto
     */
    'eslint/no-proto': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-prototype-builtins
     */
    'eslint/no-prototype-builtins': 'warn',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-redeclare
     */
    'eslint/no-redeclare': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-regex-spaces
     * No consensus as of yet
     */
    'eslint/no-regex-spaces': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-exports
     */
    'eslint/no-restricted-exports': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-globals
     * No consensus as of yet
     */
    'eslint/no-restricted-globals': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports
     * No consensus as of yet
     */
    'eslint/no-restricted-imports': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-properties
     * No consensus as of yet
     */
    'eslint/no-restricted-properties': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-return-assign
     * No consensus as of yet
     */
    'eslint/no-return-assign': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-template-curly-in-string': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-throw-literal': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unassigned-vars
     */
    'eslint/no-unassigned-vars': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-undef
     * No consensus as of yet
     */
    'eslint/no-undef': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-undefined
     * No consensus as of yet
     */
    'eslint/no-undefined': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-underscore-dangle
     * No consensus as of yet
     */
    'eslint/no-underscore-dangle': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unexpected-multiline
     * No consensus as of yet
     */
    'eslint/no-unexpected-multiline': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unmodified-loop-condition
     * No consensus as of yet
     */
    'eslint/no-unmodified-loop-condition': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-unreachable-loop': 'off',
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
     * No consensus as of yet
     */
    'eslint/no-useless-constructor': 'off',
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
    'eslint/no-useless-return': 'warn',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-var
     */
    'eslint/no-var': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-void
     * No consensus as of yet
     */
    'eslint/no-void': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-warning-comments
     * No consensus as of yet
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
     * No consensus as of yet
     */
    'eslint/one-var': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/operator-assignment
     * No consensus as of yet
     */
    'eslint/operator-assignment': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-arrow-callback
     * No consensus as of yet
     */
    'eslint/prefer-arrow-callback': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-const
     */
    'eslint/prefer-const': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-destructuring
     * No consensus as of yet
     */
    'eslint/prefer-destructuring': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-exponentiation-operator
     */
    'eslint/prefer-exponentiation-operator': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-named-capture-group
     * No consensus as of yet
     */
    'eslint/prefer-named-capture-group': 'off',
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
     * No consensus as of yet
     */
    'eslint/prefer-regex-literals': 'off',
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
    'eslint/prefer-template': 'warn',
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
     * No consensus as of yet
     */
    'eslint/require-await': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-unicode-regexp
     * No consensus as of yet
     */
    'eslint/require-unicode-regexp': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-yield
     * No consensus as of yet
     */
    'eslint/require-yield': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-imports
     */
    'eslint/sort-imports': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-keys
     * No consensus as of yet
     */
    'eslint/sort-keys': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-vars
     * No consensus as of yet
     */
    'eslint/sort-vars': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/symbol-description
     * No consensus as of yet
     */
    'eslint/symbol-description': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/unicode-bom
     * No consensus as of yet
     */
    'eslint/unicode-bom': 'off',
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
     * No consensus as of yet
     */
    'eslint/vars-on-top': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/eslint/yoda
     * No consensus as of yet
     */
    'eslint/yoda': 'off',
  },
})
