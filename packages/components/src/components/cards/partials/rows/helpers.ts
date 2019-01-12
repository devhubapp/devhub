import { GitHubURLOptions, memoizeMultipleArgs } from '@devhub/core'
import { Browser } from '../../../../libs/browser'
import { fixURL } from '../../../../utils/helpers/github/url'

const baseURL = 'https://github.com'

export const getGitHubURLPressHandler = memoizeMultipleArgs(
  (
    url?: string,
    { commentId, issueOrPullRequestNumber }: GitHubURLOptions = {},
  ) => {
    const fixedURL = fixURL(url, { commentId, issueOrPullRequestNumber })
    return fixedURL ? () => Browser.openURL(fixedURL) : undefined
  },
)

export const getBranchURL = memoizeMultipleArgs(
  (ownerName?: string, repositoryName?: string, branch?: string) =>
    ownerName && repositoryName && branch
      ? `${baseURL}/${ownerName}/${repositoryName}/tree/${branch}`
      : undefined,
)

export const getRepositoryURL = memoizeMultipleArgs(
  (ownerName?: string, repositoryName?: string) =>
    ownerName && repositoryName
      ? `${baseURL}/${ownerName}/${repositoryName}`
      : undefined,
)

export const getUserURL = memoizeMultipleArgs(
  (username: string, { isBot }: { isBot?: boolean } = {}) =>
    username ? `${baseURL}/${isBot ? 'apps/' : ''}${username}` : undefined,
)
