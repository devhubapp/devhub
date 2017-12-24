import R from 'ramda'
import SafariView from 'react-native-safari-view'

export const getUserPressHandler = R.memoize(
  (username?: string) =>
    username ? () => SafariView.show({ url: `https://github.com/${username}` }) : undefined,
) as (username?: string) => () => void | undefined

export const getRepositoryPressHandler = R.memoize(
  (owner?: string, repository?: string) =>
    owner && repository
      ? () => SafariView.show({ url: `https://github.com/${owner}/${repository}` })
      : undefined,
) as (owner?: string, repository?: string) => () => void | undefined
