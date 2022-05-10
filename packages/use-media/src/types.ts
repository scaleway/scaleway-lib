import { DependencyList, EffectCallback } from 'react'

export type Effect = (effect: EffectCallback, deps?: DependencyList) => void
