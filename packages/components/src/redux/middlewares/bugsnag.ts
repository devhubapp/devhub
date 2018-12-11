import { bugsnag } from '../../libs/bugsnag'
import { Middleware } from '../types'

export const bugsnagMiddleware: Middleware = () => next => action => {
  try {
    if (bugsnag) {
      bugsnag.leaveBreadcrumb('Redux', {
        type: 'state',
        action: action.type,
      })
    }
    next(action)
  } catch (error) {
    console.error(error)

    if (bugsnag) {
      bugsnag.notify(error, { action })
    }

    throw error
  }
}
