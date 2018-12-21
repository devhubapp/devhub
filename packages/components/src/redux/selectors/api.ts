import { RootState } from '../types'

const s = (state: RootState) => state.api || {}

export const githubApiHeadersSelector = (state: RootState) =>
  s(state).github || {}
