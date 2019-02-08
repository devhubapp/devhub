import { GitHubURLOptions, memoizeMultipleArgs } from '@devhub/core'
import { Browser } from '../../../../libs/browser'
import { fixURL } from '../../../../utils/helpers/github/url'

export const getGitHubURLPressHandler = memoizeMultipleArgs(
  (
    url?: string,
    { commentId, issueOrPullRequestNumber }: GitHubURLOptions = {},
  ) => {
    const fixedURL = fixURL(url, { commentId, issueOrPullRequestNumber })
    return fixedURL ? () => Browser.openURL(fixedURL) : undefined
  },
)
