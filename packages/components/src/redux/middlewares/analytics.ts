import { analytics } from '../../libs/analytics'
import { Middleware } from '../types'

export const analyticsMiddleware: Middleware = () => next => action => {
  if (
    action &&
    !action.type.includes('@') &&
    !action.type.includes('persist') &&
    !action.type.includes('MODAL') &&
    !action.type.includes('FETCH')
  ) {
    analytics.trackEvent('redux', 'dispatch', action.type)
  }

  next(action)
}
