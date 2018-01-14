import R from 'ramda'
import SafariView from 'react-native-safari-view'

import { fixURL } from '../../../../utils/helpers/github/url'

const baseURL = 'https://github.com'

export const getGithubURLPressHandler = R.memoize(
  (
    url?: string,
    { issueOrPullRequestNumber }: { issueOrPullRequestNumber?: number } = {},
  ) => {
    const fixedURL = fixURL(url, { issueOrPullRequestNumber })
    return fixedURL ? () => SafariView.show({ url: fixedURL }) : undefined
  },
) as (
  url?: string,
  options?: { issueOrPullRequestNumber?: number },
) => () => void | undefined

export const getBranchPressHandler = R.memoize(
  (ownerName?: string, repositoryName?: string, branch?: string) =>
    ownerName && repositoryName && branch
      ? getGithubURLPressHandler(
          `${baseURL}/${ownerName}/${repositoryName}/tree/${branch}`,
        )
      : undefined,
) as (
  ownerName?: string,
  repositoryName?: string,
  branch?: string,
) => () => void | undefined

export const getRepositoryPressHandler = R.memoize(
  (ownerName?: string, repositoryName?: string) =>
    ownerName && repositoryName
      ? getGithubURLPressHandler(`${baseURL}/${ownerName}/${repositoryName}`)
      : undefined,
) as (owner?: string, repositoryName?: string) => () => void | undefined

export const getUserPressHandler = R.memoize(
  (username: string, { isBot }: { isBot?: boolean } = {}) =>
    username
      ? getGithubURLPressHandler(
          `${baseURL}/${isBot ? 'apps/' : ''}${username}`,
        )
      : undefined,
) as (username: string, options?: { isBot?: boolean }) => () => void | undefined
