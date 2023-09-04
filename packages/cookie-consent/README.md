# Shire - Cookie Consent

This package contains the Cookie Consent modals and providers logic.

## QuickStart

### Prerequisites

```
$ cd packages/cookie-consent
```

### Start

```bash
$ pnpm build # Build the package
$ pnpm watch # Build the package and watch for changes
```

### How it works 

  flowchart TD
      Z[Application boot] -..-> A
      subgraph "Cookie Consent booting"
      A[First user navigation in app] --> B{isConsentRequired}
      B --> |false| C[do nothing with cookies]
      B --> |true| D[Fetch segment integrations configuration]
      D --> E[Generate hash of integration and define required consent categories depending on integration]
      E -..->F[Set needConsent to true]
      end
      subgraph "Consent storage"
      F -..-> | | G[/User saveConsent with categories/]
      G --> H[Hash of integration is stored in _scw_rgpd_hash cookie with storage of 6 months]
      G --> I[_scw_rgpd_$category$ cookie is stored for each accepted cookie consent category, 6 months for ad consent, 13 month for others]
      H & I --> J[needConsent is set to false]
      end
      subgraph "User come back on website in futur (within cookie duration)"
      J -..-> K[Application boot]
      K -..-> L[Check value fo cookies _scw_rgpd_hash and _scw_rgpd_$categorie$]
      L --> M[Load in context accepted categories]
      end
    subgraph "User come back after 6 months"
    J -...-> N[Application boot]
    N -..-> O[Check value fo cookies _scw_rgpd_hash and _scw_rgpd_$categorie$]
    O --> B
    end
