import { Platform } from '../../libs/platform'
import { Middleware } from '../types'

export const electronMiddleware: Middleware = (store) => {
  if (Platform.isElectron) {
    window.ipc.addListener('redux', (_e: any, action: any, ...args: any[]) => {
      if (!(action && action.type && typeof action.type === 'string')) return
      store.dispatch(action)
    })
  }

  return (next) => (action) => {
    next(action)
  }
}
