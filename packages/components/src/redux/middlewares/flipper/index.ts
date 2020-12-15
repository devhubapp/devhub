import { Middleware } from '../../types'

export function createFlipperMiddleware(): Middleware {
  return (_store) => (next) => (action) => {
    next(action)
  }
}
