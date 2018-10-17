import { memoize } from 'ramda'

import { Browser } from '../../../../libs/browser'
import { fixURL, GitHubURLOptions } from '../../../../utils/helpers/github/url'

const baseURL = 'https://github.com'

export const getGitHubURLPressHandler = memoize(
  (url?: string, { commentId, issueOrPullRequestNumber }: GitHubURLOptions = {}) => {
    const fixedURL = fixURL(url, { commentId, issueOrPullRequestNumber })
    return fixedURL ? () => Browser.openURL(fixedURL) : undefined
  },
)

export const getBranchURL = memoize(
  (ownerName?: string, repositoryName?: string, branch?: string) =>
    ownerName && repositoryName && branch
      ? `${baseURL}/${ownerName}/${repositoryName}/tree/${branch}`
      : undefined,
)

export const getRepositoryURL = memoize(
  (ownerName?: string, repositoryName?: string) =>
    ownerName && repositoryName
      ? `${baseURL}/${ownerName}/${repositoryName}`
      : undefined,
)

export const getUserURL = memoize(
  (username: string, { isBot }: { isBot?: boolean } = {}) =>
    username ? `${baseURL}/${isBot ? 'apps/' : ''}${username}` : undefined,
)
