#!/usr/bin/env node

import { run } from './generateChangeset.ts'

await run().catch(console.error)
