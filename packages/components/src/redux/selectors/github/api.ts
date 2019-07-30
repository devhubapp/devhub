import { GitHubAPIHeaders } from '@devhub/core'
import { EMPTY_OBJ } from '../../../utils/constants'
import { RootState } from '../../types'

const s = (state: RootState) => (state.github && state.github.api) || EMPTY_OBJ

export const githubAPIHeadersSelector = (state: RootState) =>
  s(state).headers || (EMPTY_OBJ as Partial<GitHubAPIHeaders>)
