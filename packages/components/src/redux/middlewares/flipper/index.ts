import { Middleware } from '../../types'

export function flipperMiddleware(): Middleware {
  return (_store) => (next) => (action) => {
    next(action)
  }
}
