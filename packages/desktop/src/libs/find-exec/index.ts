// Source: https://github.com/shime/find-exec/blob/master/index.js

import { execSync } from 'child_process'
import os from 'os'

export function findExec(...args: [string[]] | string[]) {
  const commands = Array.isArray(args[0])
    ? args[0]
    : Array.prototype.slice.apply(args)

  let command = ''
  commands.some(c => {
    if (isExec(findCommand(c))) {
      command = c
      return true
    }
  })

  return command
}

function isExec(command: string) {
  try {
    execSync(command)
    return true
  } catch (_e) {
    return false
  }
}

function findCommand(command: string) {
  if (/^win/.test(os.platform())) {
    return 'where ' + command
  }

  return 'command -v ' + command
}
