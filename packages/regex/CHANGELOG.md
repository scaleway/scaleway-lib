# Change Log

## 5.2.0

### Minor Changes

- [#2132](https://github.com/scaleway/scaleway-lib/pull/2132) [`fbe702b`](https://github.com/scaleway/scaleway-lib/commit/fbe702b32aa734e46836d267c23ddcc960b2d550) Thanks [@JulienSaguez](https://github.com/JulienSaguez)! - Add `elevenDigitsCode` and `nineDigitsCode` regex

## 5.1.0

### Minor Changes

- [#1960](https://github.com/scaleway/scaleway-lib/pull/1960) [`d034b3c`](https://github.com/scaleway/scaleway-lib/commit/d034b3cda1cac30ce2ed4e95be5a2c79642f8ca4) Thanks [@Slashgear](https://github.com/Slashgear)! - add legacy main attribut for CommonJS export usage

## 5.0.1

### Patch Changes

- [#1943](https://github.com/scaleway/scaleway-lib/pull/1943) [`e726def`](https://github.com/scaleway/scaleway-lib/commit/e726def8e0cb4593f800f9acecca51b173ae907a) Thanks [@philibea](https://github.com/philibea)! - Migration from rollup to vite

## 5.0.0

### Major Changes

- [#1837](https://github.com/scaleway/scaleway-lib/pull/1837) [`5404963`](https://github.com/scaleway/scaleway-lib/commit/5404963ddd01fafe6ed9753d8324fb19849065ca) Thanks [@philibea](https://github.com/philibea)! - upgrade node version from 14 to 20

## 4.2.1

### Patch Changes

- [#1680](https://github.com/scaleway/scaleway-lib/pull/1680) [`c2fa21f`](https://github.com/scaleway/scaleway-lib/commit/c2fa21ffc7fe5d15a1f6cd24523d129ec1c445db) Thanks [@philibea](https://github.com/philibea)! - Update pathSegment regex

## 4.2.0

### Minor Changes

- [#1605](https://github.com/scaleway/scaleway-lib/pull/1605) [`b7030c8`](https://github.com/scaleway/scaleway-lib/commit/b7030c8fdc14995f0fe66f1dcfd4fc538a82e14f) Thanks [@DorianMaliszewski](https://github.com/DorianMaliszewski)! - fix: absolute path is more permissive

## 4.1.0

### Minor Changes

- [#1493](https://github.com/scaleway/scaleway-lib/pull/1493) [`7f4a667`](https://github.com/scaleway/scaleway-lib/commit/7f4a66773dfc3c90c6c3e8905cbfe8cb2a4c15f3) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add `pathSegment` and `absolutePath` regex

- [#1448](https://github.com/scaleway/scaleway-lib/pull/1448) [`809a9ac`](https://github.com/scaleway/scaleway-lib/commit/809a9ac4189d72bd8b8b4cd10631334060e39a41) Thanks [@johnrazeur](https://github.com/johnrazeur)! - Add subdomain regex

## 4.0.0

### Major Changes

- [#1442](https://github.com/scaleway/scaleway-lib/pull/1442) [`c39764e`](https://github.com/scaleway/scaleway-lib/commit/c39764e869fcce3471d6c2c4e35272c86ad24f90) Thanks [@vincentaudebert](https://github.com/vincentaudebert)! - Rename few regex and camelcase all of them for more consistency. Also creates alphanumDashUnderscoreDots.

  Here is the full list of changes:

  - alphaLower -> alphaLowercase
  - alphanumdash -> alphanumDash
  - alphanumdashdots -> alphanumDashDots
  - alphanumdashdotsorempty -> alphanumDashDotsOrEmpty
  - alphanumdashdotsspaces -> alphanumDashDotsSpaces
  - alphanumdashunderscore -> alphanumDashUnderscore
  - alphanumdashunderscoredotsspacesparenthesis -> alphanumDashUnderscoreDotsSpacesParenthesis
  - alphanumdashorempty -> alphanumDashOrEmpty
  - alphanumdashspaces -> alphanumDashSpaces
  - alphanumdots -> alphanumDots
  - alphanumdashLowercase -> alphanumDashLowercase
  - alphanumSpacesDotsUnderscoreDash -> alphanumDashUnderscoreDotsSpaces
  - alphanumUnderscoreDash -> alphanumDashUnderscore
  - alphanumUnderscoreDollarDash -> alphanumDashUnderscoreDollar

## 3.2.0

### Minor Changes

- [#1393](https://github.com/scaleway/scaleway-lib/pull/1393) [`e3561b6`](https://github.com/scaleway/scaleway-lib/commit/e3561b680f1d9868717656be02364951948c2ee9) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add alphanumdashunderscore regex

## 3.1.2

### Patch Changes

- [#1380](https://github.com/scaleway/scaleway-lib/pull/1380) [`c0e0d51`](https://github.com/scaleway/scaleway-lib/commit/c0e0d5104680149f9b38ae509b17d14a66c4d733) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add `exports` field & fix package lint errors

## 3.1.1

### Patch Changes

- [#1254](https://github.com/scaleway/scaleway-lib/pull/1254) [`1af34cb`](https://github.com/scaleway/scaleway-lib/commit/1af34cb8a49cb1d5fd5ddaf608df4d1c160b2e10) Thanks [@ModuloM](https://github.com/ModuloM)! - Add Scaleway access key regex.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.1.0 (2023-01-12)

### :package: Chore

- **release:** publish ([22abd68](https://github.com/scaleway/scaleway-lib/commit/22abd687033bcd8c7cd187c8a9370c02fe7c0ef4))

### :gear: Features

- **regex:** advanced domain regex for non ASCII characters ([#1156](https://github.com/scaleway/scaleway-lib/issues/1156)) ([6b896f8](https://github.com/scaleway/scaleway-lib/commit/6b896f824a773e0fa342357e11074551688429e3))

## 3.0.0 (2023-01-06)

### ⚠ BREAKING CHANGES

- packages are ESM only

### :package: Chore

- **release:** publish ([20c9d4f](https://github.com/scaleway/scaleway-lib/commit/20c9d4fb39822245252bf362bc7a8d26127e511d))

### :gear: Features

- publish packages as ESM only ([#1145](https://github.com/scaleway/scaleway-lib/issues/1145)) ([4c25097](https://github.com/scaleway/scaleway-lib/commit/4c25097254a5ba7f0a5dbb6fdf5d6578a75f777a))

## 2.9.1 (2022-12-29)

### Bug Fixes

- specify sideEffect free packages ([#1134](https://github.com/scaleway/scaleway-lib/issues/1134)) ([20510f0](https://github.com/scaleway/scaleway-lib/commit/20510f0f66fde99e682529db28fe85d580efe474))

## 2.9.0 (2022-12-27)

### Features

- add reverse dns and dashed ip ([#1131](https://github.com/scaleway/scaleway-lib/issues/1131)) ([3673084](https://github.com/scaleway/scaleway-lib/commit/367308431ba55770782bc7baf68829ddbb28bb59))

## 2.8.0 (2022-12-20)

### Features

- **regex:** add alphanumdashunderscoredotsparenthesis regex ([#1126](https://github.com/scaleway/scaleway-lib/issues/1126)) ([f7c0dda](https://github.com/scaleway/scaleway-lib/commit/f7c0ddab694e02d443c9c1c3fae788be4c1bd5b1))

## 2.7.0 (2022-12-14)

### Features

- new regex for alphanum dash lowercase ([#1117](https://github.com/scaleway/scaleway-lib/issues/1117)) ([08ccc99](https://github.com/scaleway/scaleway-lib/commit/08ccc995bce2cb355e75d3b36fac1ba5c1d89e2c))

## 2.6.0 (2022-11-29)

### Features

- **regex:** add s3 bucket name regex ([#1093](https://github.com/scaleway/scaleway-lib/issues/1093)) ([deff2ca](https://github.com/scaleway/scaleway-lib/commit/deff2ca550807f2195184ec1f529ec1b3170b4d4))

## 2.5.3 (2022-11-17)

### Bug Fixes

- cron regex ([#1079](https://github.com/scaleway/scaleway-lib/issues/1079)) ([deb52ae](https://github.com/scaleway/scaleway-lib/commit/deb52aead1ff5ec81c443ca8a7f737c822a3da36))

## 2.5.2 (2022-09-23)

**Note:** Version bump only for package @scaleway/regex

## 2.5.1 (2022-09-19)

**Note:** Version bump only for package @scaleway/regex

## 2.5.0 (2022-09-13)

### Features

- **regex:** add cidr regex ([#982](https://github.com/scaleway/scaleway-lib/issues/982)) ([dc32290](https://github.com/scaleway/scaleway-lib/commit/dc3229007463f7f1ab5267a2efd9851bb629b625))

## 2.4.0 (2022-09-08)

### Features

- **regex:** add ip regexes ([#972](https://github.com/scaleway/scaleway-lib/issues/972)) ([98c6ded](https://github.com/scaleway/scaleway-lib/commit/98c6deda557af0cd41b1a6064946af2dea6680c2))

## 2.3.0 (2022-08-01)

### Features

- add new regex `alphaDashes` to the list ([#901](https://github.com/scaleway/scaleway-lib/issues/901)) ([608f823](https://github.com/scaleway/scaleway-lib/commit/608f8230badb68dcbcb5eab95c1661f97652a042))

### 2.2.3 (2022-04-26)

### Bug Fixes

- **regex:** improve url regex ([#736](https://github.com/scaleway/scaleway-lib/issues/736)) ([c340227](https://github.com/scaleway/scaleway-lib/commit/c340227da34141c978237e7659404df84e680d7a))

### 2.2.2 (2022-04-05)

**Note:** Version bump only for package @scaleway/regex

### 2.2.1 (2022-03-11)

**Note:** Version bump only for package @scaleway/regex

## 2.2.0 (2022-01-19)

### Features

- add alphaLower and basicDomain regex ([#600](https://github.com/scaleway/scaleway-lib/issues/600)) ([418bda9](https://github.com/scaleway/scaleway-lib/commit/418bda9db7c3c342565e01433461d78079bb1b76))

## 2.1.0 (2021-11-23)

### Features

- add absolute path regex ([#514](https://github.com/scaleway/scaleway-lib/issues/514)) ([f271d72](https://github.com/scaleway/scaleway-lib/commit/f271d7251198f2119480a02dce844a283452e061))

## 2.0.0 (2021-07-20)

### ⚠ BREAKING CHANGES

- migrate the codebase to typescript

### Code Refactoring

- migrate to typescript ([#272](https://github.com/scaleway/scaleway-lib/issues/272)) ([3923c68](https://github.com/scaleway/scaleway-lib/commit/3923c68d6f7feadee7e2e30e32c9ef5d1f3003b9))

### 1.4.3 (2021-05-11)

**Note:** Version bump only for package @scaleway/regex

### 1.4.2 (2021-05-10)

**Note:** Version bump only for package @scaleway/regex

### 1.4.1 (2021-04-15)

### Bug Fixes

- add hexa regex ([#130](https://github.com/scaleway/scaleway-lib/issues/130)) ([a67e2e6](https://github.com/scaleway/scaleway-lib/commit/a67e2e65db928816bfa745bcf6f9631811e7640d))

# 1.4.0 (2021-03-12)

### Features

- add mac address regex ([#67](https://github.com/scaleway/scaleway-lib/issues/67)) ([a4d8c83](https://github.com/scaleway/scaleway-lib/commit/a4d8c8300f1d8503ca0f8bbfbb8a4595fc24123c))

## [1.3.1](https://github.com/scaleway/scaleway-lib/compare/@scaleway/regex@1.3.0...@scaleway/regex@1.3.1) (2021-02-15)

**Note:** Version bump only for package @scaleway/regex

# [1.3.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/regex@1.2.0...@scaleway/regex@1.3.0) (2021-02-15)

### Features

- **eslint:** enable not yet enabled react plugin rules from airbnb ([#27](https://github.com/scaleway/scaleway-lib/issues/27)) ([78c9692](https://github.com/scaleway/scaleway-lib/commit/78c9692fe56ca308e49fb1bb9ac80b5a6217a6f3))

# 1.2.0 (2021-01-28)

### Features

- **regex:** add deploy package ([b288c6f](https://github.com/scaleway/scaleway-lib/commit/b288c6f06bd6107064f5ea74acb2207954ec08e2))

# 1.1.0 (2020-11-09)

### Features

- **regex:** add deploy package ([7fd5f83](https://github.com/scaleway/scaleway-lib/commit/7fd5f83f31737dc11946bb9bcbd16cf443c4af0d))
