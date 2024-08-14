# `@scaleway/changesets-renovate`

## Automatically create changesets for Renovate

## Install

```bash
$ pnpm add --global @scaleway/changesets-renovate
```

## Usage

This package is a very simple CLI:

```bash
changesets-renovate
```

To skip committing the changeset.

```bash
SKIP_COMMIT=TRUE changesets-renovate
```

To have a custom prefix for renovate branch name instead of `renovate/`

```bash
BRANCH_PREFIX=dep-upgrade changesets-renovate
```

To skip checking the branch name starts `renovate/`

```bash
SKIP_BRANCH_CHECK=TRUE changesets-renovate
```

It's inspired by this GitHub Action from Backstage: https://github.com/backstage/backstage/blob/master/.github/workflows/sync_renovate-changesets.yml
