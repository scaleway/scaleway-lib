# @scaleway/pnpm-auto-release

CLI to bump and publish changed packages in a pnpm monorepo via changesets.

Detects which packages changed since the last `chore(release): publish` commit,
writes changeset files, then delegates to `pnpm` for version bumping (including
dependency propagation) and publishing.

## Usage

```sh
pnpm-auto-release [options]
```

### Options

| Flag                   | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `-r, --registry <url>` | npm registry to publish to                                      |
| `-m, --message <text>` | Changeset summary (default: `update generated APIs`)            |
| `--dry-run`            | Report what would happen, no writes/publishes                   |
| `--skip-publish`       | Bump and tag, but don't publish to the registry                 |
| `--skip-push`          | Don't push the release commit and tags                          |
| `--by-commit`          | Create one changeset per commit (default: one for all affected) |
| `--gh-release`         | Create GitHub releases for the published packages               |
| `-h, --help`           | Show help                                                       |

### Environment variables

| Variable              | Description                                 |
| --------------------- | ------------------------------------------- |
| `NPM_REGISTRY_USER`   | Registry username (used with `--registry`)  |
| `NPM_REGISTRY_PASSWD` | Registry password (used with `--registry`)  |
| `GH_TOKEN`            | GitHub token (required with `--gh-release`) |

## Install

```sh
pnpm add -D @scaleway/pnpm-auto-release
```
