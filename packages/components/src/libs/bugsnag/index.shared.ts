/*
import _ from 'lodash'

import { BugnsagCrossPlatform } from '.'

const consoleError = console.error
export function overrideConsoleError(bugsnag: BugnsagCrossPlatform) {
  console.error = (...args: any[]) => {
    const realError = args.find(a => a instanceof Error)
    const description = args.find(a => typeof a === 'string')
    const obj = args.find(a => _.isPlainObject(a)) || {}

    const error = realError || (description && new Error(description)) || {}
    Object.assign(error, {
      ...obj,
      name: error.name || obj.name || 'console.error',
      message: error.message || obj.message || 'Error from console.error',
      description:
        description === error.message || obj.message ? undefined : description,
      payload: args.filter(a => a !== error),
    })

    bugsnag.notify(error)
    consoleError(...args)
  }
}
*/

export function hideTokenFromString(str: string) {
  if (!(str && typeof str === 'string')) return str
  return str.replace(/(token=[\\]?["']?)([A-Za-z0-9\.\-_]+)/gi, '$1REDACTED')
}
