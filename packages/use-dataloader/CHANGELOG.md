# Change Log

## 5.5.0

### Minor Changes

- [#2598](https://github.com/scaleway/scaleway-lib/pull/2598) [`70852bc`](https://github.com/scaleway/scaleway-lib/commit/70852bc2384622e94ba4874cec390d63b771dd44) Thanks [@DorianMaliszewski](https://github.com/DorianMaliszewski)! - Fix infinite dataloader effects that reset the page everytime

### Patch Changes

- [#2639](https://github.com/scaleway/scaleway-lib/pull/2639) [`305b084`](https://github.com/scaleway/scaleway-lib/commit/305b0840229836dd77298a5ed4f48937e6e97245) Thanks [@philibea](https://github.com/philibea)! - update packages

## 5.4.0

### Minor Changes

- [#2590](https://github.com/scaleway/scaleway-lib/pull/2590) [`36d8d9e`](https://github.com/scaleway/scaleway-lib/commit/36d8d9ef98586f58462b5993d4f9217696ae15a6) Thanks [@DorianMaliszewski](https://github.com/DorianMaliszewski)! - Fix : Ensure observers are correctly added at mount to handle components mount/unmount quick chaining.

## 5.3.0

### Minor Changes

- [#2548](https://github.com/scaleway/scaleway-lib/pull/2548) [`5a569a1`](https://github.com/scaleway/scaleway-lib/commit/5a569a16caa14d7bebea56c14eb4c43b1592dfda) Thanks [@DorianMaliszewski](https://github.com/DorianMaliszewski)! - Fix: useInfiniteDataloader doesnt update on params change

- [#2548](https://github.com/scaleway/scaleway-lib/pull/2548) [`5a569a1`](https://github.com/scaleway/scaleway-lib/commit/5a569a16caa14d7bebea56c14eb4c43b1592dfda) Thanks [@DorianMaliszewski](https://github.com/DorianMaliszewski)! - Feat: Add a default lifetime on the provider

## 5.2.0

### Minor Changes

- [#2282](https://github.com/scaleway/scaleway-lib/pull/2282) [`d153ea4`](https://github.com/scaleway/scaleway-lib/commit/d153ea43f8d052a57f1d8cfa33b99142ab4432a0) Thanks [@DorianMaliszewski](https://github.com/DorianMaliszewski)! - Add useInfiniteDataLoader

## 5.1.3

### Patch Changes

- [#2364](https://github.com/scaleway/scaleway-lib/pull/2364) [`463f5bc`](https://github.com/scaleway/scaleway-lib/commit/463f5bc9b67bfca8dc7faa27cac0fda6d13050af) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `react` to `19.0.0`.
  Updated dependency `react-dom` to `19.0.0`.
  Updated dependency `@types/react` to `19.0.0`.
  Updated dependency `@types/react-dom` to `19.0.0`.

## 5.1.2

### Patch Changes

- [#2376](https://github.com/scaleway/scaleway-lib/pull/2376) [`3d90660`](https://github.com/scaleway/scaleway-lib/commit/3d90660ed13e552f4bbe349def70fc8326dea49b) Thanks [@philibea](https://github.com/philibea)! - update package json export dist file only

## 5.1.1

### Patch Changes

- [#2277](https://github.com/scaleway/scaleway-lib/pull/2277) [`21a2dc6`](https://github.com/scaleway/scaleway-lib/commit/21a2dc6cf7df20c3423de2cadfd07e51ff5f7d2b) Thanks [@philibea](https://github.com/philibea)! - export a datalifetime object

## 5.1.0

### Minor Changes

- [#1960](https://github.com/scaleway/scaleway-lib/pull/1960) [`d034b3c`](https://github.com/scaleway/scaleway-lib/commit/d034b3cda1cac30ce2ed4e95be5a2c79642f8ca4) Thanks [@Slashgear](https://github.com/Slashgear)! - add legacy main attribut for CommonJS export usage

## 5.0.1

### Patch Changes

- [#1943](https://github.com/scaleway/scaleway-lib/pull/1943) [`e726def`](https://github.com/scaleway/scaleway-lib/commit/e726def8e0cb4593f800f9acecca51b173ae907a) Thanks [@philibea](https://github.com/philibea)! - Migration from rollup to vite

## 5.0.0

### Major Changes

- [#1837](https://github.com/scaleway/scaleway-lib/pull/1837) [`5404963`](https://github.com/scaleway/scaleway-lib/commit/5404963ddd01fafe6ed9753d8324fb19849065ca) Thanks [@philibea](https://github.com/philibea)! - upgrade node version from 14 to 20

## 4.0.2

### Patch Changes

- [#1380](https://github.com/scaleway/scaleway-lib/pull/1380) [`c0e0d51`](https://github.com/scaleway/scaleway-lib/commit/c0e0d5104680149f9b38ae509b17d14a66c4d733) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add `exports` field & fix package lint errors

## 4.0.1

### Patch Changes

- [#1258](https://github.com/scaleway/scaleway-lib/pull/1258) [`9f22073`](https://github.com/scaleway/scaleway-lib/commit/9f220738be71d6ae01da7f032849fc62f96ab9e6) Thanks [@ModuloM](https://github.com/ModuloM)! - Fix case where cache array key with false value was ignored.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2023-02-06)

### ⚠ BREAKING CHANGES

- **paginated-dataloader:** BREAKING CHANGE: usePaginatedDataloader does no exist anymore

### :package: Chore

- **release:** publish ([2ce37e3](https://github.com/scaleway/scaleway-lib/commit/2ce37e3b836aa8c957ef6fb31d96658f064c5b40))

### :gear: Features

- **paginated-dataloader:** BREAKING CHANGE: usePaginatedDataloader does no exist anymore ([303cffc](https://github.com/scaleway/scaleway-lib/commit/303cffcd228c6eafcbd029bc08c958d8c17b1f41))

## 3.0.1 (2023-01-13)

### :package: Chore

- **release:** publish ([9d6de7b](https://github.com/scaleway/scaleway-lib/commit/9d6de7b63065f53774cb64b0e5a46a868dc9933a))

### :bug: Bug Fixes

- harden ts code ([#1158](https://github.com/scaleway/scaleway-lib/issues/1158)) ([7e2130e](https://github.com/scaleway/scaleway-lib/commit/7e2130ea4c2a079c69ec49b27444daa8f6076d03))

## 3.0.0 (2023-01-06)

### ⚠ BREAKING CHANGES

- packages are ESM only

### :package: Chore

- **release:** publish ([20c9d4f](https://github.com/scaleway/scaleway-lib/commit/20c9d4fb39822245252bf362bc7a8d26127e511d))

### :gear: Features

- publish packages as ESM only ([#1145](https://github.com/scaleway/scaleway-lib/issues/1145)) ([4c25097](https://github.com/scaleway/scaleway-lib/commit/4c25097254a5ba7f0a5dbb6fdf5d6578a75f777a))

## [2.16.7](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.16.6...@scaleway/use-dataloader@2.16.7) (2023-01-04)

### Bug Fixes

- **prop-types:** remove usage of proptypes ([#1140](https://github.com/scaleway/scaleway-lib/issues/1140)) ([f511af5](https://github.com/scaleway/scaleway-lib/commit/f511af5d81d765274b4b86cebd676229aea7bc8e))

## 2.16.6 (2022-12-29)

### Bug Fixes

- specify sideEffect free packages ([#1134](https://github.com/scaleway/scaleway-lib/issues/1134)) ([20510f0](https://github.com/scaleway/scaleway-lib/commit/20510f0f66fde99e682529db28fe85d580efe474))

## 2.16.5 (2022-12-27)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.16.4 (2022-12-15)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.16.3 (2022-12-09)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.16.2 (2022-12-01)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.16.1 (2022-09-26)

**Note:** Version bump only for package @scaleway/use-dataloader

## [2.16.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.15.0...@scaleway/use-dataloader@2.16.0) (2022-08-19)

### Features

- react 18 only ([#925](https://github.com/scaleway/scaleway-lib/issues/925)) ([f46adf6](https://github.com/scaleway/scaleway-lib/commit/f46adf6f4e38dc6fbabedaef8faad3ee654444a6))

## 2.15.0 (2022-08-16)

### Features

- **use-dataloader:** handle primitive array key ([#920](https://github.com/scaleway/scaleway-lib/issues/920)) ([13958ae](https://github.com/scaleway/scaleway-lib/commit/13958aedd41838de95afa94b7852b5474b833110))

## [2.14.3](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.14.2...@scaleway/use-dataloader@2.14.3) (2022-07-18)

### Bug Fixes

- paginated typing ([#886](https://github.com/scaleway/scaleway-lib/issues/886)) ([e2816c5](https://github.com/scaleway/scaleway-lib/commit/e2816c5ee61f5841b69603bbe63400e2b6240df9))

## 2.14.2 (2022-07-15)

### Bug Fixes

- use-dataloader types improvement ([#880](https://github.com/scaleway/scaleway-lib/issues/880)) ([25fb1a5](https://github.com/scaleway/scaleway-lib/commit/25fb1a5a7917a51721de738268aba8b024611b4e))

## 2.14.1 (2022-06-07)

### Bug Fixes

- optimistic isloading value on hook mount ([#831](https://github.com/scaleway/scaleway-lib/issues/831)) ([3e57d55](https://github.com/scaleway/scaleway-lib/commit/3e57d55721b6d2157d4bf53b925146b9fd8b550e))

## 2.14.0 (2022-06-06)

### Features

- introduce datalifetime in dataloader ([#817](https://github.com/scaleway/scaleway-lib/issues/817)) ([7b39c50](https://github.com/scaleway/scaleway-lib/commit/7b39c50b24bf8232644c6e5fef4d2252ec821076))

## [2.13.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.12.0...@scaleway/use-dataloader@2.13.0) (2022-05-24)

### Features

- use interval instead of timeout ([#796](https://github.com/scaleway/scaleway-lib/issues/796)) ([6c02b39](https://github.com/scaleway/scaleway-lib/commit/6c02b39412b7cdf59e7d50a2a1759d0d8da1d94e))

## 2.12.0 (2022-05-24)

### Features

- improve polling timeout effect and enabled refetching ([#795](https://github.com/scaleway/scaleway-lib/issues/795)) ([1ed1cbc](https://github.com/scaleway/scaleway-lib/commit/1ed1cbcef9964ee1d25e8fca9a517bfb8d73b689))

## 2.11.0 (2022-05-23)

### Features

- dataloader v2 ([#786](https://github.com/scaleway/scaleway-lib/issues/786)) ([850a23a](https://github.com/scaleway/scaleway-lib/commit/850a23acc36e75be6dc737e1bffddea6f1351635))

### 2.10.3 (2022-05-11)

**Note:** Version bump only for package @scaleway/use-dataloader

### 2.10.2 (2022-04-28)

**Note:** Version bump only for package @scaleway/use-dataloader

### [2.10.1](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.10.0...@scaleway/use-dataloader@2.10.1) (2022-04-05)

### Bug Fixes

- **deps:** update typescript-eslint monorepo to v5.16.0 ([#683](https://github.com/scaleway/scaleway-lib/issues/683)) ([abf59fc](https://github.com/scaleway/scaleway-lib/commit/abf59fc3c9e0fc6cdd766ac453cc5a6c2dc0e578))

## 2.10.0 (2022-04-05)

### Features

- **react:** new automatic runtime ([#695](https://github.com/scaleway/scaleway-lib/issues/695)) ([8238a62](https://github.com/scaleway/scaleway-lib/commit/8238a6258999141c585d8051b18c1076b0a5fae5))

### 2.9.3 (2022-03-11)

**Note:** Version bump only for package @scaleway/use-dataloader

### 2.9.2 (2022-02-23)

### Bug Fixes

- when data is false return initialData instead of data ([#649](https://github.com/scaleway/scaleway-lib/issues/649)) ([b72440e](https://github.com/scaleway/scaleway-lib/commit/b72440e4033dc2f9e0551b241ad3de66f5c8e2fa))

### 2.9.1 (2022-01-26)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.9.0 (2022-01-24)

### Features

- improve dataloader refetch handling ([#608](https://github.com/scaleway/scaleway-lib/issues/608)) ([fbdf8e8](https://github.com/scaleway/scaleway-lib/commit/fbdf8e8f49a84655d92914fb4822938e453b3ba3))

## 2.8.0 (2022-01-18)

### Features

- dont clear cached data when no observer ([#599](https://github.com/scaleway/scaleway-lib/issues/599)) ([7acff81](https://github.com/scaleway/scaleway-lib/commit/7acff8190a8c115faab84213ea74e1bfb5b54592))

### [2.7.4](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.7.3...@scaleway/use-dataloader@2.7.4) (2022-01-06)

### Bug Fixes

- **deps:** update dependency prop-types to v15.8.1 ([#579](https://github.com/scaleway/scaleway-lib/issues/579)) ([b4379ec](https://github.com/scaleway/scaleway-lib/commit/b4379eceffb075b1b4dc03eaa6da835e1433ce6e))

### 2.7.3 (2022-01-04)

### Bug Fixes

- **deps:** update formatjs monorepo ([#527](https://github.com/scaleway/scaleway-lib/issues/527)) ([4b54f61](https://github.com/scaleway/scaleway-lib/commit/4b54f611759a1ca7f9b1762966222ef2143ea38d))

### 2.7.2 (2022-01-03)

**Note:** Version bump only for package @scaleway/use-dataloader

### 2.7.1 (2021-12-24)

### Bug Fixes

- **deps:** update dependency prop-types to v15.8.0 ([#556](https://github.com/scaleway/scaleway-lib/issues/556)) ([24bede8](https://github.com/scaleway/scaleway-lib/commit/24bede8b2174d2b470e8bc7653789bb72158185f))

## 2.7.0 (2021-12-17)

### Features

- add paginated dataloader ([#524](https://github.com/scaleway/scaleway-lib/issues/524)) ([a440e71](https://github.com/scaleway/scaleway-lib/commit/a440e717a717a7639563671986eba0b2af8a5451))

### 2.6.1 (2021-12-10)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.6.0 (2021-11-30)

### Features

- add needPolling callback ([#520](https://github.com/scaleway/scaleway-lib/issues/520)) ([fc28e6d](https://github.com/scaleway/scaleway-lib/commit/fc28e6df063bb0235874a219a48081283c3e23e3))

### 2.5.7 (2021-11-23)

### Bug Fixes

- **use-dataloader:** ignore some eslint v8 errors ([#513](https://github.com/scaleway/scaleway-lib/issues/513)) ([8a53696](https://github.com/scaleway/scaleway-lib/commit/8a53696ce1fe178ebf14142f21448d79d023f6ae))

### 2.5.6 (2021-11-16)

### Bug Fixes

- correct some eslint errors ([#490](https://github.com/scaleway/scaleway-lib/issues/490)) ([e8aecf6](https://github.com/scaleway/scaleway-lib/commit/e8aecf66db19e55623ff39d34a6d20076f151584))

### 2.5.5 (2021-10-27)

### Bug Fixes

- polling interval update dataloader instance ([#460](https://github.com/scaleway/scaleway-lib/issues/460)) ([ac7180e](https://github.com/scaleway/scaleway-lib/commit/ac7180e6c36f309e12b110fcaf396c887b800d26))

### [2.5.4](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.5.3...@scaleway/use-dataloader@2.5.4) (2021-10-21)

**Note:** Version bump only for package @scaleway/use-dataloader

### [2.5.3](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.5.2...@scaleway/use-dataloader@2.5.3) (2021-10-21)

**Note:** Version bump only for package @scaleway/use-dataloader

### 2.5.2 (2021-10-20)

### Bug Fixes

- useeffect that handle enable change ([#440](https://github.com/scaleway/scaleway-lib/issues/440)) ([9be4809](https://github.com/scaleway/scaleway-lib/commit/9be48092aa40910d57b60ca1f6eb854638677ecc))

### [2.5.1](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.5.0...@scaleway/use-dataloader@2.5.1) (2021-10-13)

### Bug Fixes

- force new update because of https://status.npmjs.org/incidents/wy4002vc8ryc ([#433](https://github.com/scaleway/scaleway-lib/issues/433)) ([3182928](https://github.com/scaleway/scaleway-lib/commit/31829280a082e6688e2df0e13ecf6d1ee5aceae6))

## 2.5.0 (2021-10-11)

### Features

- max concurrent request usedataloader ([#413](https://github.com/scaleway/scaleway-lib/issues/413)) ([ef91862](https://github.com/scaleway/scaleway-lib/commit/ef918626d889037289833372e084eff4233efd26))

## [2.4.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@2.3.0...@scaleway/use-dataloader@2.4.0) (2021-09-28)

### Features

- refresh data on max lifetime reached ([#399](https://github.com/scaleway/scaleway-lib/issues/399)) ([152642b](https://github.com/scaleway/scaleway-lib/commit/152642bc521f9e84a4de236ea58b8cc0dfdaaf0b))

## 2.3.0 (2021-09-27)

### Features

- concurrent request handle with dataloader ([#392](https://github.com/scaleway/scaleway-lib/issues/392)) ([7f6d50c](https://github.com/scaleway/scaleway-lib/commit/7f6d50c1f08c4a1ad851f2efefb781de6180653f))

## 2.2.0 (2021-09-09)

### Features

- request cancellation ([#369](https://github.com/scaleway/scaleway-lib/issues/369)) ([78d26b2](https://github.com/scaleway/scaleway-lib/commit/78d26b2b96ed614360171f28719f800a630488d8))

### 2.1.1 (2021-08-30)

**Note:** Version bump only for package @scaleway/use-dataloader

## 2.1.0 (2021-07-21)

### Features

- **use-dataloader:** add global onError handler ([#286](https://github.com/scaleway/scaleway-lib/issues/286)) ([e881b5e](https://github.com/scaleway/scaleway-lib/commit/e881b5e5e1436cb0a1d2f19021be9544fa0c0d77))

## 2.0.0 (2021-07-20)

### ⚠ BREAKING CHANGES

- migrate the codebase to typescript

### Code Refactoring

- migrate to typescript ([#272](https://github.com/scaleway/scaleway-lib/issues/272)) ([3923c68](https://github.com/scaleway/scaleway-lib/commit/3923c68d6f7feadee7e2e30e32c9ef5d1f3003b9))

### [1.4.3](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.4.2...@scaleway/use-dataloader@1.4.3) (2021-06-23)

**Note:** Version bump only for package @scaleway/use-dataloader

### [1.4.2](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.4.1...@scaleway/use-dataloader@1.4.2) (2021-05-31)

### Bug Fixes

- enabled effect and drop unecessary refs ([#213](https://github.com/scaleway/scaleway-lib/issues/213)) ([abe7409](https://github.com/scaleway/scaleway-lib/commit/abe7409c53657191481fa39d52d19bd7094aab1b))

### [1.4.1](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.4.0...@scaleway/use-dataloader@1.4.1) (2021-05-31)

### Bug Fixes

- **use-dataloader:** move cacheKeyPrefix logic into hook to trigger reload ([#203](https://github.com/scaleway/scaleway-lib/issues/203)) ([0d5e587](https://github.com/scaleway/scaleway-lib/commit/0d5e58790ed15fd5af0a3f7c28d5fefca4aedca2))

## [1.4.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.3.0...@scaleway/use-dataloader@1.4.0) (2021-05-27)

### Features

- **use-dataloader:** add cache key prefix on Provider ([#202](https://github.com/scaleway/scaleway-lib/issues/202)) ([e995550](https://github.com/scaleway/scaleway-lib/commit/e9955507074cc6e6c373961fd7d83dc332e23ce9))

## [1.3.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.2.2...@scaleway/use-dataloader@1.3.0) (2021-05-25)

### Features

- use dataloader handle enabled changes ([#196](https://github.com/scaleway/scaleway-lib/issues/196)) ([644ddb7](https://github.com/scaleway/scaleway-lib/commit/644ddb7ae1252fc92edd25a15302f69483f9cc06))

### 1.2.2 (2021-05-25)

**Note:** Version bump only for package @scaleway/use-dataloader

### [1.2.1](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.2.0...@scaleway/use-dataloader@1.2.1) (2021-05-19)

**Note:** Version bump only for package @scaleway/use-dataloader

## [1.2.0](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.1.5...@scaleway/use-dataloader@1.2.0) (2021-05-11)

### Features

- **eslint:** add sort-key, sort prop-types, no bind jsx ([#167](https://github.com/scaleway/scaleway-lib/issues/167)) ([41086e8](https://github.com/scaleway/scaleway-lib/commit/41086e88ee4fc040c1277e99cd65ead8f9d294e8))

### [1.1.5](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.1.4...@scaleway/use-dataloader@1.1.5) (2021-05-11)

**Note:** Version bump only for package @scaleway/use-dataloader

### [1.1.4](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.1.3...@scaleway/use-dataloader@1.1.4) (2021-05-10)

### Bug Fixes

- bad condition inside handleRequest ([#165](https://github.com/scaleway/scaleway-lib/issues/165)) ([11cbd72](https://github.com/scaleway/scaleway-lib/commit/11cbd72344ce7feed8ed81680af4b29d76575ac0))

### 1.1.3 (2021-05-10)

**Note:** Version bump only for package @scaleway/use-dataloader

### [1.1.2](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.1.1...@scaleway/use-dataloader@1.1.2) (2021-05-04)

### Bug Fixes

- DataLoaderProvider handle data return from useDataLoader ([#150](https://github.com/scaleway/scaleway-lib/issues/150)) ([acd938f](https://github.com/scaleway/scaleway-lib/commit/acd938f48bef8856476e12cf421193d8c8eab284))

### [1.1.1](https://github.com/scaleway/scaleway-lib/compare/@scaleway/use-dataloader@1.1.0...@scaleway/use-dataloader@1.1.1) (2021-05-03)

### Bug Fixes

- **use-dataloader:** avoid exception when options are not defined ([#148](https://github.com/scaleway/scaleway-lib/issues/148)) ([347e539](https://github.com/scaleway/scaleway-lib/commit/347e5391c50a576f816df2a7d05414ff1570c3bb))

## 1.1.0 (2021-04-30)

### Features

- use dataloader ([#134](https://github.com/scaleway/scaleway-lib/issues/134)) ([915b0f1](https://github.com/scaleway/scaleway-lib/commit/915b0f118dd7f9fc2ce14be4b8ce099f970271be))
