// oxlint-disable max-lines
import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'react-perf', 'jsx-a11y'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/button-has-type
     */
    'react/button-has-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/capitalized-calls
     */
    'react/capitalized-calls': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/checked-requires-onchange-or-readonly
     */
    'react/checked-requires-onchange-or-readonly': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/display-name
     */
    'react/display-name': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/error-boundaries
     */
    'react/error-boundaries': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-deps
     */
    'react/exhaustive-deps': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-effect-dependencies
     */
    'react/exhaustive-effect-dependencies': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-component-props
     */
    'react/forbid-component-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-dom-props
     */
    'react/forbid-dom-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-elements
     */
    'react/forbid-elements': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forward-ref-uses-ref
     */
    'react/forward-ref-uses-ref': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/function-component-definition
     */
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/globals
     */
    'react/globals': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/hook-use-state
     */
    'react/hook-use-state': ['error', { allowDestructuredState: true }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/hooks
     */
    'react/hooks': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/iframe-missing-sandbox
     */
    'react/iframe-missing-sandbox': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/immutability
     */
    'react/immutability': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/incompatible-library
     */
    'react/incompatible-library': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/invariant
     */
    'react/invariant': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-boolean-value
     */
    'react/jsx-boolean-value': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-curly-brace-presence
     */
    'react/jsx-curly-brace-presence': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-filename-extension
     */
    'react/jsx-filename-extension': ['error', { extensions: ['jsx', 'tsx'] }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-fragments
     */
    'react/jsx-fragments': ['error', 'syntax'],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-handler-names
     * @todo Needs to be reviewed
     */
    'react/jsx-handler-names': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-key
     */
    'react/jsx-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-max-depth
     */
    'react/jsx-max-depth': ['error', { max: 5 }],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-comment-textnodes
     */
    'react/jsx-no-comment-textnodes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-constructed-context-values
     */
    'react/jsx-no-constructed-context-values': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-duplicate-props
     */
    'react/jsx-no-duplicate-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-literals
     */
    'react/jsx-no-literals': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-script-url
     */
    'react/jsx-no-script-url': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-target-blank
     */
    'react/jsx-no-target-blank': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-undef
     */
    'react/jsx-no-undef': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-useless-fragment
     */
    'react/jsx-no-useless-fragment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-pascal-case
     */
    'react/jsx-pascal-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spread-multi
     */
    'react/jsx-props-no-spread-multi': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spreading
     */
    'react/jsx-props-no-spreading': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/memo-dependencies
     */
    'react/memo-dependencies': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-array-index-key
     */
    'react/no-array-index-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-children-prop
     */
    'react/no-children-prop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-clone-element
     */
    'react/no-clone-element': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-danger
     */
    'react/no-danger': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-danger-with-children
     */
    'react/no-danger-with-children': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-deriving-state-in-effects
     */
    'react/no-deriving-state-in-effects': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-did-mount-set-state
     */
    'react/no-did-mount-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-did-update-set-state
     */
    'react/no-did-update-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-direct-mutation-state
     */
    'react/no-direct-mutation-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-find-dom-node
     */
    'react/no-find-dom-node': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-is-mounted
     */
    'react/no-is-mounted': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-multi-comp
     * @todo Needs to be reviewed
     */
    'react/no-multi-comp': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-namespace
     */
    'react/no-namespace': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-object-type-as-default-prop
     */
    'react/no-object-type-as-default-prop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-react-children
     */
    'react/no-react-children': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-redundant-should-component-update
     */
    'react/no-redundant-should-component-update': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-render-return-value
     */
    'react/no-render-return-value': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-set-state
     */
    'react/no-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-string-refs
     */
    'react/no-string-refs': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-this-in-sfc
     */
    'react/no-this-in-sfc': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unescaped-entities
     */
    'react/no-unescaped-entities': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unknown-property
     */
    'react/no-unknown-property': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unsafe
     */
    'react/no-unsafe': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unstable-nested-components
     */
    'react/no-unstable-nested-components': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-will-update-set-state
     */
    'react/no-will-update-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/only-export-components
     */
    'react/only-export-components': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/prefer-es6-class
     */
    'react/prefer-es6-class': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/prefer-function-component
     */
    'react/prefer-function-component': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/preserve-manual-memoization
     */
    'react/preserve-manual-memoization': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/purity
     */
    'react/purity': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope
     */
    'react/react-in-jsx-scope': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/refs
     */
    'react/refs': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/require-render-return
     */
    'react/require-render-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/rule-suppression
     */
    'react/rule-suppression': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks
     */
    'react/rules-of-hooks': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/self-closing-comp
     */
    'react/self-closing-comp': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/set-state-in-effect
     */
    'react/set-state-in-effect': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/set-state-in-render
     */
    'react/set-state-in-render': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/state-in-constructor
     */
    'react/state-in-constructor': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/static-components
     */
    'react/static-components': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/style-prop-object
     */
    'react/style-prop-object': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/syntax
     */
    'react/syntax': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/todo
     * @todo Needs to be reviewed
     */
    'react/todo': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/unsupported-syntax
     */
    'react/unsupported-syntax': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/use-memo
     */
    'react/use-memo': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/void-dom-elements-no-children
     */
    'react/void-dom-elements-no-children': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/void-use-memo
     */
    'react/void-use-memo': 'error',

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/alt-text
     */
    'jsx-a11y/alt-text': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-ambiguous-text
     */
    'jsx-a11y/anchor-ambiguous-text': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-has-content
     */
    'jsx-a11y/anchor-has-content': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-is-valid
     */
    'jsx-a11y/anchor-is-valid': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-activedescendant-has-tabindex
     */
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-props
     */
    'jsx-a11y/aria-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-proptypes
     */
    'jsx-a11y/aria-proptypes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-role
     */
    'jsx-a11y/aria-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-unsupported-elements
     */
    'jsx-a11y/aria-unsupported-elements': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/autocomplete-valid
     */
    'jsx-a11y/autocomplete-valid': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/click-events-have-key-events
     */
    'jsx-a11y/click-events-have-key-events': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/control-has-associated-label
     */
    'jsx-a11y/control-has-associated-label': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/heading-has-content
     */
    'jsx-a11y/heading-has-content': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/html-has-lang
     */
    'jsx-a11y/html-has-lang': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/iframe-has-title
     */
    'jsx-a11y/iframe-has-title': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/img-redundant-alt
     */
    'jsx-a11y/img-redundant-alt': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/interactive-supports-focus
     */
    'jsx-a11y/interactive-supports-focus': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/label-has-associated-control
     */
    'jsx-a11y/label-has-associated-control': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/lang
     */
    'jsx-a11y/lang': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/media-has-caption
     */
    'jsx-a11y/media-has-caption': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/mouse-events-have-key-events
     */
    'jsx-a11y/mouse-events-have-key-events': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-access-key
     */
    'jsx-a11y/no-access-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-aria-hidden-on-focusable
     */
    'jsx-a11y/no-aria-hidden-on-focusable': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-autofocus
     */
    'jsx-a11y/no-autofocus': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-distracting-elements
     */
    'jsx-a11y/no-distracting-elements': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-interactive-element-to-noninteractive-role
     */
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-element-interactions
     */
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-element-to-interactive-role
     */
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-tabindex
     */
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-redundant-roles
     */
    'jsx-a11y/no-redundant-roles': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-static-element-interactions
     */
    'jsx-a11y/no-static-element-interactions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/prefer-tag-over-role
     */
    'jsx-a11y/prefer-tag-over-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/role-has-required-aria-props
     */
    'jsx-a11y/role-has-required-aria-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/role-supports-aria-props
     */
    'jsx-a11y/role-supports-aria-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/scope
     */
    'jsx-a11y/scope': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/tabindex-no-positive
     */
    'jsx-a11y/tabindex-no-positive': 'error',
  },
  settings: {
    'jsx-a11y': {
      components: {
        polymorphicPropName: 'as',
      },
    },
    react: {},
  },
})
