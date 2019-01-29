import { GitHubRepo } from '../../types'

export interface GitHubURLOptions {
  addBottomAnchor?: boolean
  commentId?: number
  issueOrPullRequestNumber?: number
}

export const baseURL = 'https://github.com'

export function getCommentIdFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/comments\/([0-9]+)([?].+)?$/)
  return (matches && matches[1] && parseInt(matches[1], 10)) || null
}

export function getCommitShaFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/commits\/([a-zA-Z0-9]+)([?].+)?$/)
  return (matches && matches[1]) || null
}

export function getIssueOrPullRequestNumberFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/(issues|pulls)\/([0-9]+)([?].+)?$/)
  const issueOrPullRequestNumber = matches && matches[2]

  return (
    (issueOrPullRequestNumber && parseInt(issueOrPullRequestNumber, 10)) || null
  )
}

export function getReleaseIdFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/releases\/([0-9]+)([?].+)?$/)
  return (matches && matches[1]) || null
}

/* eslint-disable-next-line no-useless-escape */
export const getRepoFullNameFromUrl = (url: string): string =>
  url
    ? (url.match(
        /(github.com\/(repos\/)?)([a-zA-Z0-9\-._]+\/[a-zA-Z0-9\-._]+[^/#$]?)/i,
      ) || [])[3] || ''
    : ''

export const getRepoFullNameFromObject = (repo: GitHubRepo): string =>
  (repo &&
    (repo.full_name ||
      repo.name ||
      getRepoFullNameFromUrl(repo.html_url || repo.url))) ||
  ''

export const getGitHubURLForUser = (user: string) =>
  user ? `${baseURL}/${user}` : ''

const objToQueryParams = (obj: { [key: string]: string | number }) =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')

export const getGitHubSearchURL = (queryParams: {
  [key: string]: string | number
}) => (queryParams ? `${baseURL}/search?${objToQueryParams(queryParams)}` : '')

export const getGitHubURLForBranch = (repoFullName: string, branch: string) =>
  repoFullName && branch ? `${baseURL}/${repoFullName}/tree/${branch}` : ''

export const getGitHubURLForRelease = (
  repoFullName: string,
  tagName: string | undefined,
) =>
  repoFullName
    ? tagName
      ? `${baseURL}/${repoFullName}/releases/tag/${tagName}`
      : `${baseURL}/${repoFullName}/releases`
    : ''

export const getGitHubURLForRepo = (repoFullName: string) =>
  repoFullName ? `${baseURL}/${repoFullName}` : ''

export const getGitHubURLForRepoInvitation = (repoFullName: string) =>
  repoFullName ? `${baseURL}/${repoFullName}/invitations` : ''

export const getGitHubURLForSecurityAlert = (repoFullName: string) =>
  repoFullName ? `${baseURL}/${repoFullName}/network/alerts` : ''

export const getGitHubAvatarURLFromPayload = (
  payload: any,
  userId?: number | string,
) => {
  if (!payload) return undefined

  const fields = Object.getOwnPropertyNames(payload)
  const fieldWithAvatar = fields.find(field => {
    const hasAvatar =
      payload[field] &&
      payload[field].user &&
      payload[field].user.avatar_url &&
      typeof payload[field].user.avatar_url === 'string'
    if (!hasAvatar) return false

    if (userId && `${payload[field].user.id}` !== `${userId}`) return false

    return true
  })
  if (!fieldWithAvatar) return undefined

  return payload[fieldWithAvatar].user.avatar_url as string
}

export function appBottomAnchorIfPossible(uri: string, realOSName: string) {
  if (!uri) return ''

  const anchorId = realOSName === 'web' ? 'partial-timeline' : 'bottom'
  return uri.includes('#') ? uri : `${uri}#${anchorId}`
}

export function githubHTMLUrlFromAPIUrl(
  apiURL: string,
  realOSName: string,
  {
    addBottomAnchor,
    commentId,
    issueOrPullRequestNumber,
  }: GitHubURLOptions = {},
): string {
  if (!apiURL) return ''

  const [, type, restOfURL] = apiURL.match(
    'api.github.com/([a-zA-Z]+)/(.*)',
  ) as string[]
  if (!(type && restOfURL)) return ''

  if (type === 'repos') {
    const repoFullName = getRepoFullNameFromUrl(apiURL)
    const [type2, ...restOfURL2] = (
      apiURL.split(`/repos/${repoFullName}/`)[1] || ''
    ).split('/')

    if (restOfURL2[0]) {
      switch (type2) {
        case 'commits': {
          if (commentId) {
            return `${baseURL}/${repoFullName}/commit/${
              restOfURL2[0]
            }#commitcomment-${commentId}`
          }

          return `${baseURL}/${repoFullName}/commit/${restOfURL2.join('/')}`
        }

        case 'issues':
          if (
            issueOrPullRequestNumber &&
            (commentId || (restOfURL2[0] === 'comments' && restOfURL2[1]))
          ) {
            return `${baseURL}/${repoFullName}/issues/${issueOrPullRequestNumber}#issuecomment-${commentId ||
              restOfURL2[1]}`
          }

          return `${baseURL}/${repoFullName}/issues/${restOfURL2.join('/')}`

        case 'pulls':
          if (
            issueOrPullRequestNumber &&
            (commentId || (restOfURL2[0] === 'comments' && restOfURL2[1]))
          ) {
            return `${baseURL}/${repoFullName}/pull/${issueOrPullRequestNumber}#discussion_r${commentId ||
              restOfURL2[1]}`
          }

          return `${baseURL}/${repoFullName}/pull/${restOfURL2.join('/')}`

        case 'releases':
          // it wont go directly to the release, but to the generic releases page.
          // we would need to have the tag name to do that.
          return `${baseURL}/${repoFullName}/releases/?${restOfURL2.join('/')}`

        default:
          return `${baseURL}/${restOfURL}`
      }
    }
  }

  const uri = `${baseURL}/${restOfURL}`

  return addBottomAnchor ? appBottomAnchorIfPossible(uri, realOSName) : uri
}

export function fixURLForPlatform(
  url: string,
  realOSName: string,
  options?: GitHubURLOptions,
) {
  if (!url) return ''

  // sometimes the url come like this: '/facebook/react', so we add https://github.com
  let uri =
    url[0] === '/' && url.indexOf('github.com') < 0 ? `${baseURL}${url}` : url

  if (uri.indexOf('api.github.com') >= 0)
    uri = githubHTMLUrlFromAPIUrl(uri, realOSName, options)

  return options && options.addBottomAnchor
    ? appBottomAnchorIfPossible(uri, realOSName)
    : uri
}
