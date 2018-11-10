import { createSelector } from 'reselect'
import { RootState } from '../../types'

const s = (state: RootState) => state.columns || {}

export const createColumnSelector = () =>
  createSelector(
    (state: RootState) => s(state).byId,
    (_state: RootState, id: string) => id,
    (byId, id) => byId && byId[id],
  )

export const columnIdsSelector = (state: RootState) => s(state).allIds

export const columnsArrSelector = createSelector(
  (state: RootState) => columnIdsSelector(state),
  (state: RootState) => s(state).byId,
  (allIds, byId) => (byId ? allIds.map(id => byId[id]) : []),
)

export const hasCreatedColumnSelector = (state: RootState) =>
  s(state).byId !== null
