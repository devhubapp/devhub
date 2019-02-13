import { RootState } from '../types'

const s = (state: RootState) => state.api || {}

export const githubAPIHeadersSelector = (state: RootState) =>
  s(state).github || {}
