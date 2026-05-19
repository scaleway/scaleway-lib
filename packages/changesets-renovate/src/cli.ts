#!/usr/bin/env node

import { run } from './generateChangeset.ts'

// oxlint-disable-next-line eslint/no-console
await run().catch(console.error)
