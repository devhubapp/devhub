import R from 'ramda'
import SafariView from 'react-native-safari-view'

import { fixURL, IURLOptions } from '../../../../utils/helpers/github/url'

const baseURL = 'https://github.com'

export const getGithubURLPressHandler = R.memoize(
  (url?: string, { commentId, issueOrPullRequestNumber }: IURLOptions = {}) => {
    const fixedURL = fixURL(url, { commentId, issueOrPullRequestNumber })
    return fixedURL ? () => SafariView.show({ url: fixedURL }) : undefined
  },
)

export const getBranchPressHandler = R.memoize(
  (ownerName?: string, repositoryName?: string, branch?: string) =>
    ownerName && repositoryName && branch
      ? getGithubURLPressHandler(
          `${baseURL}/${ownerName}/${repositoryName}/tree/${branch}`,
        )
      : undefined,
)

export const getRepositoryPressHandler = R.memoize(
  (ownerName?: string, repositoryName?: string) =>
    ownerName && repositoryName
      ? getGithubURLPressHandler(`${baseURL}/${ownerName}/${repositoryName}`)
      : undefined,
)

export const getUserPressHandler = R.memoize(
  (username: string, { isBot }: { isBot?: boolean } = {}) =>
    username
      ? getGithubURLPressHandler(
          `${baseURL}/${isBot ? 'apps/' : ''}${username}`,
        )
      : undefined,
)
