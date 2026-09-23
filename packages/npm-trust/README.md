# @scaleway/npm-trust

Configure [npm trusted publishers](https://docs.npmjs.com/trusted-publishers) (GitHub Actions OIDC) for all public packages in a pnpm workspace.

Trusted publishing lets GitHub Actions publish to npm without a long-lived `NPM_TOKEN` — npm exchanges a short-lived GitHub OIDC token for a publish token at release time. This CLI automates the npm-side configuration: it registers each public workspace package's GitHub Actions workflow as a trusted publisher.

## Prerequisites

- `npm login` (needed for `npm trust` commands)
- Node >= 22, pnpm >= 12

## Usage

### Configure trust for all public packages

```bash
pnpm exec npm-trust --repo <owner/name>
```

This will:

1. List all non-private workspace packages.
2. Detect any that are not yet published to npm and offer to publish them first.
3. For each package, check if trust is already configured. If not, run `npm trust github` to register the GitHub Actions workflow as a trusted publisher.

### Check mode (CI gate)

```bash
pnpm exec npm-trust --check --repo <owner/name>
```

Exits with code `1` if any public package is not yet published on npm. Use this in CI to block merges that add a new publishable package without publishing it first. No npm auth required — uses anonymous `npm view` queries.

### Options

```
Options:
  -f, --file <workflow>   GitHub Actions workflow file (default: deploy-package.yml)
  -r, --repo <owner/name> GitHub repository
      --dry-run           Report what would happen, no changes
      --check             Only check for unpublished packages; exit 1 if any found
  -y, --yes               Skip prompts, answer yes to everything
  -h, --help              Show this help
```

## CI integration

### Block PRs that add unpublished packages

```yaml
# .github/workflows/ci.yml
jobs:
  npm-trust-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: ./.github/actions/setup-node-pnpm
      - run: pnpm exec npm-trust --check --repo ${{ github.repository }}
```

### Gate releases on trust configuration

```yaml
# .github/workflows/release.yml
steps:
  - name: Check npm trust
    run: pnpm exec npm-trust --check --repo ${{ github.repository }}
```

The check runs before the changesets publish step, ensuring no release proceeds with unpublished packages that lack trusted publishing.

## OIDC setup

Once trust is configured via this CLI, the release workflow can publish without `NPM_TOKEN`:

```yaml
permissions:
  id-token: write # required for OIDC

env:
  NPM_CONFIG_PROVENANCE: 'true'
```

See the [npm trusted publishers guide](https://docs.npmjs.com/trusted-publishers) for more details.
