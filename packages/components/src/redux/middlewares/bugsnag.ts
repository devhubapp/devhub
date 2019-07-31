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
  } catch (error) {
    console.error(`Failed to leave bugsnag breadcrumb. ${error}`)
    throw error
  }

  try {
    next(action)
  } catch (error) {
    console.error(`Failed to run redux action ${action.type}. ${error}`)
    throw error
  }
}
