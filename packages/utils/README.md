# @scaleway-lib/utils

Utility scripts and tools for scaleway-lib.

## Scripts

### check-catalog-usage

Validates that dependencies use catalog references instead of hardcoded versions.

```bash
npx check-catalog-usage
```

Or as an npm script:

```json
{
  "scripts": {
    "lint:catalog": "check-catalog-usage"
  }
}
```

## Programmatic Usage

```javascript
import { checkCatalogUsage } from '@scaleway-lib/utils'

// Run the validation
checkCatalogUsage()
```

## Installation

```bash
npm install @scaleway-lib/utils
```