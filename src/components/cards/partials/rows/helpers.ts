import R from 'ramda'
import SafariView from 'react-native-safari-view'

import { fixURL } from '../../../../utils/helpers/github/url'

const baseURL = 'https://github.com'

export const getGithubURLPressHandler = R.memoize((url?: string) => {
  const fixedURL = fixURL(url)
  return fixedURL ? () => SafariView.show({ url: fixedURL }) : undefined
}) as (url?: string) => () => void | undefined

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
  (username?: string) =>
    username ? getGithubURLPressHandler(`${baseURL}/${username}`) : undefined,
) as (username?: string) => () => void | undefined
