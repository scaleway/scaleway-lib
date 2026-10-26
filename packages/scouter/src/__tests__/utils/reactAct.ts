import { act as reactAct } from 'react'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

// vitest-browser-react sets IS_REACT_ACT_ENVIRONMENT only inside its own act
// scopes, so standalone act calls must mirror the flag around React's act
// or react-dom logs "not configured to support act(...)" on every call.
export const act = async (callback: () => unknown) => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  try {
    await reactAct(callback)
  } finally {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false
  }
}
