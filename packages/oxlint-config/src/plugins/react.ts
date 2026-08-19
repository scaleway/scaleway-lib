import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'react-perf', 'jsx-a11y'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/button-has-type
     * No consensus as of yet
     */
    'react/button-has-type': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/checked-requires-onchange-or-readonly
     * No consensus as of yet
     */
    'react/checked-requires-onchange-or-readonly': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/display-name
     * No consensus as of yet
     */
    'react/display-name': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-deps
     * No consensus as of yet
     */
    'react/exhaustive-deps': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-component-props
     * No consensus as of yet
     */
    'react/forbid-component-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-dom-props
     * No consensus as of yet
     */
    'react/forbid-dom-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-elements
     * No consensus as of yet
     */
    'react/forbid-elements': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forward-ref-uses-ref
     * No consensus as of yet
     */
    'react/forward-ref-uses-ref': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/function-component-definition
     * No consensus as of yet
     */
    'react/function-component-definition': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/hook-use-state
     * No consensus as of yet
     */
    'react/hook-use-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/iframe-missing-sandbox
     * No consensus as of yet
     */
    'react/iframe-missing-sandbox': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-boolean-value
     * No consensus as of yet
     */
    'react/jsx-boolean-value': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-curly-brace-presence
     * No consensus as of yet
     */
    'react/jsx-curly-brace-presence': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-filename-extension
     * No consensus as of yet
     */
    'react/jsx-filename-extension': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-fragments
     * No consensus as of yet
     */
    'react/jsx-fragments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-handler-names
     * No consensus as of yet
     */
    'react/jsx-handler-names': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-key
     * No consensus as of yet
     */
    'react/jsx-key': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-max-depth
     * No consensus as of yet
     */
    'react/jsx-max-depth': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-comment-textnodes
     * No consensus as of yet
     */
    'react/jsx-no-comment-textnodes': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-constructed-context-values
     * No consensus as of yet
     */
    'react/jsx-no-constructed-context-values': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-duplicate-props
     * No consensus as of yet
     */
    'react/jsx-no-duplicate-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-literals
     * No consensus as of yet
     */
    'react/jsx-no-literals': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-script-url
     * No consensus as of yet
     */
    'react/jsx-no-script-url': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-target-blank
     * No consensus as of yet
     */
    'react/jsx-no-target-blank': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-undef
     * No consensus as of yet
     */
    'react/jsx-no-undef': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-useless-fragment
     * No consensus as of yet
     */
    'react/jsx-no-useless-fragment': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-pascal-case
     * No consensus as of yet
     */
    'react/jsx-pascal-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spread-multi
     * No consensus as of yet
     */
    'react/jsx-props-no-spread-multi': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spreading
     * No consensus as of yet
     */
    'react/jsx-props-no-spreading': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-array-index-key
     * No consensus as of yet
     */
    'react/no-array-index-key': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-children-prop
     * No consensus as of yet
     */
    'react/no-children-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-clone-element
     * No consensus as of yet
     */
    'react/no-clone-element': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-danger
     * No consensus as of yet
     */
    'react/no-danger': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-danger-with-children
     * No consensus as of yet
     */
    'react/no-danger-with-children': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-did-mount-set-state
     * No consensus as of yet
     */
    'react/no-did-mount-set-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-did-update-set-state
     * No consensus as of yet
     */
    'react/no-did-update-set-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-direct-mutation-state
     * No consensus as of yet
     */
    'react/no-direct-mutation-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-find-dom-node
     * No consensus as of yet
     */
    'react/no-find-dom-node': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-is-mounted
     * No consensus as of yet
     */
    'react/no-is-mounted': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-multi-comp
     * No consensus as of yet
     */
    'react/no-multi-comp': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-namespace
     * No consensus as of yet
     */
    'react/no-namespace': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-object-type-as-default-prop
     * No consensus as of yet
     */
    'react/no-object-type-as-default-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-react-children
     * No consensus as of yet
     */
    'react/no-react-children': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-redundant-should-component-update
     * No consensus as of yet
     */
    'react/no-redundant-should-component-update': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-render-return-value
     * No consensus as of yet
     */
    'react/no-render-return-value': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-set-state
     * No consensus as of yet
     */
    'react/no-set-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-string-refs
     * No consensus as of yet
     */
    'react/no-string-refs': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-this-in-sfc
     * No consensus as of yet
     */
    'react/no-this-in-sfc': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unescaped-entities
     * No consensus as of yet
     */
    'react/no-unescaped-entities': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unknown-property
     * No consensus as of yet
     */
    'react/no-unknown-property': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unsafe
     * No consensus as of yet
     */
    'react/no-unsafe': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unstable-nested-components
     * No consensus as of yet
     */
    'react/no-unstable-nested-components': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-will-update-set-state
     * No consensus as of yet
     */
    'react/no-will-update-set-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/only-export-components
     * No consensus as of yet
     */
    'react/only-export-components': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/prefer-es6-class
     * No consensus as of yet
     */
    'react/prefer-es6-class': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/prefer-function-component
     * No consensus as of yet
     */
    'react/prefer-function-component': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-compiler
     * No consensus as of yet
     */
    'react/react-compiler': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope
     * No consensus as of yet
     */
    'react/react-in-jsx-scope': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/require-render-return
     * No consensus as of yet
     */
    'react/require-render-return': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks
     * No consensus as of yet
     */
    'react/rules-of-hooks': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/self-closing-comp
     * No consensus as of yet
     */
    'react/self-closing-comp': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/state-in-constructor
     * No consensus as of yet
     */
    'react/state-in-constructor': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/style-prop-object
     * No consensus as of yet
     */
    'react/style-prop-object': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/void-dom-elements-no-children
     * No consensus as of yet
     */
    'react/void-dom-elements-no-children': 'off',

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-jsx-as-prop
     * No consensus as of yet
     */
    'react-perf/jsx-no-jsx-as-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-new-array-as-prop
     * No consensus as of yet
     */
    'react-perf/jsx-no-new-array-as-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-new-function-as-prop
     * No consensus as of yet
     */
    'react-perf/jsx-no-new-function-as-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-new-object-as-prop
     * No consensus as of yet
     */
    'react-perf/jsx-no-new-object-as-prop': 'off',

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/alt-text
     * No consensus as of yet
     */
    'jsx-a11y/alt-text': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-ambiguous-text
     * No consensus as of yet
     */
    'jsx-a11y/anchor-ambiguous-text': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-has-content
     * No consensus as of yet
     */
    'jsx-a11y/anchor-has-content': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-is-valid
     * No consensus as of yet
     */
    'jsx-a11y/anchor-is-valid': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-activedescendant-has-tabindex
     * No consensus as of yet
     */
    'jsx-a11y/aria-activedescendant-has-tabindex': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-props
     * No consensus as of yet
     */
    'jsx-a11y/aria-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-proptypes
     * No consensus as of yet
     */
    'jsx-a11y/aria-proptypes': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-role
     * No consensus as of yet
     */
    'jsx-a11y/aria-role': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-unsupported-elements
     * No consensus as of yet
     */
    'jsx-a11y/aria-unsupported-elements': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/autocomplete-valid
     * No consensus as of yet
     */
    'jsx-a11y/autocomplete-valid': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/click-events-have-key-events
     * No consensus as of yet
     */
    'jsx-a11y/click-events-have-key-events': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/control-has-associated-label
     * No consensus as of yet
     */
    'jsx-a11y/control-has-associated-label': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/heading-has-content
     * No consensus as of yet
     */
    'jsx-a11y/heading-has-content': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/html-has-lang
     * No consensus as of yet
     */
    'jsx-a11y/html-has-lang': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/iframe-has-title
     * No consensus as of yet
     */
    'jsx-a11y/iframe-has-title': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/img-redundant-alt
     * No consensus as of yet
     */
    'jsx-a11y/img-redundant-alt': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/interactive-supports-focus
     * No consensus as of yet
     */
    'jsx-a11y/interactive-supports-focus': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/label-has-associated-control
     * No consensus as of yet
     */
    'jsx-a11y/label-has-associated-control': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/lang
     * No consensus as of yet
     */
    'jsx-a11y/lang': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/media-has-caption
     * No consensus as of yet
     */
    'jsx-a11y/media-has-caption': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/mouse-events-have-key-events
     * No consensus as of yet
     */
    'jsx-a11y/mouse-events-have-key-events': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-access-key
     * No consensus as of yet
     */
    'jsx-a11y/no-access-key': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-aria-hidden-on-focusable
     * No consensus as of yet
     */
    'jsx-a11y/no-aria-hidden-on-focusable': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-autofocus
     * No consensus as of yet
     */
    'jsx-a11y/no-autofocus': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-distracting-elements
     * No consensus as of yet
     */
    'jsx-a11y/no-distracting-elements': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-interactive-element-to-noninteractive-role
     * No consensus as of yet
     */
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-element-interactions
     * No consensus as of yet
     */
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-element-to-interactive-role
     * No consensus as of yet
     */
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-tabindex
     * No consensus as of yet
     */
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-redundant-roles
     * No consensus as of yet
     */
    'jsx-a11y/no-redundant-roles': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-static-element-interactions
     * No consensus as of yet
     */
    'jsx-a11y/no-static-element-interactions': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/prefer-tag-over-role
     * No consensus as of yet
     */
    'jsx-a11y/prefer-tag-over-role': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/role-has-required-aria-props
     * No consensus as of yet
     */
    'jsx-a11y/role-has-required-aria-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/role-supports-aria-props
     * No consensus as of yet
     */
    'jsx-a11y/role-supports-aria-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/scope
     * No consensus as of yet
     */
    'jsx-a11y/scope': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/tabindex-no-positive
     * No consensus as of yet
     */
    'jsx-a11y/tabindex-no-positive': 'off',
  },
})
