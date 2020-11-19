#!/usr/bin/env node
import log from './log'
import didiff from './run'

const cmds = {
  capture: didiff,
  help: () => {
    log.info(`
Didiff 📸 comes with three commands:
    - "capture": start the capturing and diffing process. Accept one mandatory argument, a file which contains a list of url.
    - "help": print this help.

For more info, please read the docs:
    - about the lib: https://github.com/scaleway/scaleway-lib/-/tree/add-didiff-lib/packages/didiff-lib
    - about the UI: https://***REMOVED***/front/scaleway-global-differ
    `)
  },
}

const cmd = process.argv[2]

const fn = cmds[cmd || 'help']
if (!fn) {
  log.err('❌ Error: only two commands are available on Didiff.')
  log.err('Use Didiff with "capture" or "help" command')
}

fn()
