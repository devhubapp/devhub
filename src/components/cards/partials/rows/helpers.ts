import { memoize } from 'ramda'

import Browser from '../../../../libs/browser'
import { fixURL, IURLOptions } from '../../../../utils/helpers/github/url'

const baseURL = 'https://github.com'

export const getGithubURLPressHandler = memoize(
  (url?: string, { commentId, issueOrPullRequestNumber }: IURLOptions = {}) => {
    const fixedURL = fixURL(url, { commentId, issueOrPullRequestNumber })
    return fixedURL ? () => Browser.openURL(fixedURL) : undefined
  },
)

export const getBranchPressHandler = memoize(
  (ownerName?: string, repositoryName?: string, branch?: string) =>
    ownerName && repositoryName && branch
      ? getGithubURLPressHandler(
          `${baseURL}/${ownerName}/${repositoryName}/tree/${branch}`,
        )
      : undefined,
)

export const getRepositoryPressHandler = memoize(
  (ownerName?: string, repositoryName?: string) =>
    ownerName && repositoryName
      ? getGithubURLPressHandler(`${baseURL}/${ownerName}/${repositoryName}`)
      : undefined,
)

export const getUserPressHandler = memoize(
  (username: string, { isBot }: { isBot?: boolean } = {}) =>
    username
      ? getGithubURLPressHandler(
          `${baseURL}/${isBot ? 'apps/' : ''}${username}`,
        )
      : undefined,
)
