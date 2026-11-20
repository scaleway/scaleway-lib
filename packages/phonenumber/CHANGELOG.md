# @scaleway/phonenumber

## 1.0.2

### Patch Changes

- [#4167](https://github.com/scaleway/scaleway-lib/pull/4167) [`c63e533`](https://github.com/scaleway/scaleway-lib/commit/c63e533d4bf24406bc1d0a9b3c016a73e0f45444) Thanks [@chambo-e](https://github.com/chambo-e)! - `parsePhoneValue` now parses each phone value once instead of redundantly re-parsing the same value up to three times per keystroke.

## 1.0.1

### Patch Changes

- [#3702](https://github.com/scaleway/scaleway-lib/pull/3702) [`14fa445`](https://github.com/scaleway/scaleway-lib/commit/14fa4454485e6a1e5a368901a57d20c85620f758) Thanks [@chambo-e](https://github.com/chambo-e)! - Use `codePointAt` instead of `charCodeAt` when building regional indicator symbols, correctly handling characters outside the Basic Multilingual Plane

## 1.0.0

### Major Changes

- [#3365](https://github.com/scaleway/scaleway-lib/pull/3365) [`68aa8a3`](https://github.com/scaleway/scaleway-lib/commit/68aa8a344978388899c4e836c575c5e123e99bdd) Thanks [@philibea](https://github.com/philibea)! - introduce @scaleway/phonenumber
