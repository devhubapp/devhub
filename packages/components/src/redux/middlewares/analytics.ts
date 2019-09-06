import { analytics } from '../../libs/analytics'
import { Middleware } from '../types'

const strsToMatch = [
  'LOGIN',
  'LOGOUT',
  'ACCOUNT',
  'USER',
  'SYNC',
  'BANNER',
  'THEME',
  'INSTALLATION',
]

export const analyticsMiddleware: Middleware = () => next => action => {
  if (action && strsToMatch.some(str => action.type.includes(str))) {
    analytics.trackEvent('redux', 'dispatch', action.type)
  }

  next(action)
}
