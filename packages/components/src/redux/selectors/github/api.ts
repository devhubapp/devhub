import { RootState } from '../../types'

const s = (state: RootState) => (state.github && state.github.api) || {}

export const githubAPIHeadersSelector = (state: RootState) =>
  s(state).headers || {}
