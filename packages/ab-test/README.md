_# `@scaleway/ab-test`

Tiny adapter to easily add [GrowthBook](https://www.growthbook.io/) to your React Application.
The idea of this package is to propose a _facade pattern_ above GrowthBook React pattern in order to be agnostic.

## Install

```bash
$ pnpm add @scaleway/ab-test
```

## How to use

### First add the provider to your application roots

```js
import { AbTestProvider } from '@scaleway-lib/ab-test'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <AbTestProvider config={{ apiHost: 'string', clientKey: 'string', enableDevMode: true }} anonymousId="123456789" trackingCallback={(experiment, result) => console.log(experiment, result)} errorCallback={console.error} >
      <App />
    </AbTestProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
```

### Attributes

A hook `useAbTestAttributes` is available to get currentAttributes and to set new ones dynamically.

### API

Exported utils from GrowthBook React are listed here:
- FeatureString
- FeaturesReady
- IfFeatureEnabled
- useExperiment
- useFeature
- withRunExperiment
- useFeatureIsOn
- useFeatureValue
