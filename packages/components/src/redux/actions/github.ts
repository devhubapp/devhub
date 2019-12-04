import { GitHubTokenDetails } from '@devhub/core/src'

import { createAction } from '../helpers'

export function replacePersonalTokenDetails(payload: {
  tokenDetails: GitHubTokenDetails | undefined
}) {
  return createAction('REPLACE_PERSONAL_TOKEN_DETAILS', payload)
}
