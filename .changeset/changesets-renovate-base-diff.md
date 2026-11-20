---
'@scaleway/changesets-renovate': patch
---

Generate changesets from the full PR diff (`origin/$GITHUB_BASE_REF...HEAD`) instead of only the last commit, so multi-commit Renovate PRs no longer produce changesets with missing bumps. Local runs without `GITHUB_BASE_REF` keep the previous single-commit behavior.
