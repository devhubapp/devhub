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

export const analyticsMiddleware: Middleware = () => (next) => (action) => {
  if (action && strsToMatch.some((str) => action.type.includes(str))) {
    setTimeout(() => {
      analytics.trackEvent('redux', 'dispatch', action.type)
    }, 0)
  }

  next(action)
}
