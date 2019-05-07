import { GitHubAPIHeaders } from '@devhub/core'
import { RootState } from '../../types'

const emptyObj = {}

const s = (state: RootState) => (state.github && state.github.api) || emptyObj

export const githubAPIHeadersSelector = (state: RootState) =>
  s(state).headers || (emptyObj as Partial<GitHubAPIHeaders>)
