// @flow

import { SET_THEME } from '../../utils/constants/actions'
import type { Action, Theme } from '../../utils/types'

const initialState = ''

export default (
  state: Theme = initialState,
  { type, payload }: ?Action<Theme> = {},
): Theme => {
  switch (type) {
    case SET_THEME:
      return payload

    default:
      return state
  }
}
