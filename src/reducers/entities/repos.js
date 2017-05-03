// @flow

import { Map } from 'immutable'

import { STAR_REPO, UNSTAR_REPO } from '../../utils/constants/actions'
import type { Action } from '../../utils/types'

type State = Array<string>
const initialState = Map()

export default (
  state: State = initialState,
  action: Action<any> = {},
): State => {
  const { type, payload } = action || {}

  const { repoId } = payload || {}
  if (!repoId) return state

  switch (type) {
    case STAR_REPO:
      return state.setIn([repoId, 'starred'], true)
    case UNSTAR_REPO:
      return state.setIn([repoId, 'starred'], false)
    default:
      return state
  }
}
