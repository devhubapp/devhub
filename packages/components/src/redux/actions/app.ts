import { createAction } from '../helpers'

export function closeBannerMessage(id: string) {
  return createAction('CLOSE_BANNER_MESSAGE', id)
}
