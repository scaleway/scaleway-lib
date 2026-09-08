#!/usr/bin/env node

import { run } from './run'

// oxlint-disable-next-line eslint/no-console
await run().catch(console.error)
