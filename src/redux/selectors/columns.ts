import { RootState } from '../../types'

const s = (state: RootState) => state.columns

export const columnsSelector = (state: RootState) => s(state).columns
