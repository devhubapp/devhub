import { GitHubRepo } from '../../types'

export interface GitHubURLOptions {
  addBottomAnchor?: boolean
  baseURL?: string
  commentId?: number
  commentIsInline?: boolean
  issueOrPullRequestNumber?: number
}

export const defaultBaseURL = 'https://github.com'

export function getCommentIdFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/comments\/([0-9]+)([?].+)?$/)
  return (matches && matches[1] && parseInt(matches[1], 10)) || null
}

export function getCommitShaFromUrl(url: string): string | undefined {
  if (!url) return undefined

  const matches = url.match(/\/commits?\/([a-zA-Z0-9]+)([?].+)?$/)
  return (matches && matches[1]) || undefined
}

export function getCommitUrlFromOtherUrl(url: string): string | undefined {
  if (!url) return

  const repoURL = getRepoUrlFromOtherUrl(url)
  if (!repoURL) return

  const sha = getCommitShaFromUrl(url)
  if (!sha) return

  return `${repoURL}/commit/${sha}`
}

export function getCommitCompareUrlFromUrls(
  commit1URL: string,
  commit2URL: string,
): string | undefined {
  if (!(commit1URL && commit2URL)) return

  const repo1URL = getRepoUrlFromOtherUrl(commit1URL)
  const repo2URL = getRepoUrlFromOtherUrl(commit2URL)
  if (!(repo1URL && repo2URL && repo1URL === repo2URL)) return

  const sha1 = getCommitShaFromUrl(commit1URL)
  const sha2 = getCommitShaFromUrl(commit2URL)
  if (!(sha1 && sha2)) return

  return `${repo1URL}/compare/${sha1.substr(0, 7)}...${sha2.substr(0, 7)}`
}

export function getCommitCompareUrlFromRefs(
  before: string,
  head: string,
  { repoURL }: { repoURL: string },
): string | undefined {
  if (!(before && head && repoURL)) return

  return `${repoURL}/compare/${before.substr(0, 7)}...${head.substr(0, 7)}`
}

export function getIssueOrPullRequestNumberFromUrl(
  url: string,
): number | undefined {
  if (!url) return

  const matches = url.match(/\/(issues|pulls)\/([0-9]+)([?].+)?$/)
  const issueOrPullRequestNumber = matches && matches[2]

  return (
    (issueOrPullRequestNumber && parseInt(issueOrPullRequestNumber, 10)) ||
    undefined
  )
}

export function getReleaseIdFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/releases\/([0-9]+)([?].+)?$/)
  return (matches && matches[1]) || null
}

export const getBaseUrlFromOtherUrl = (
  url: string | undefined,
): string | undefined =>
  url
    ? (
        (url.match(
          /([^:]+:\/\/[^\/]+)(\/(repos\/)?)([a-zA-Z0-9\-._]+\/[a-zA-Z0-9\-._]+[^/#$]?)/i,
        ) || [])[1] || ''
      ).replace('/api.', '/') || undefined
    : undefined

export const getRepoFullNameFromUrl = (url: string): string | undefined =>
  url
    ? (url.match(
        /([^:]+:\/\/[^\/]+)(\/(repos\/)?)([a-zA-Z0-9\-._]+\/[a-zA-Z0-9\-._]+[^/#$]?)/i,
      ) || [])[4] || undefined
    : undefined

export const getRepoUrlFromFullName = (
  repoFullName: string,
  { baseURL = defaultBaseURL }: { baseURL?: string } = {},
): string | undefined => {
  return baseURL && repoFullName && repoFullName.split('/').length === 2
    ? `${baseURL}/${repoFullName}`
    : undefined
}

export const getRepoUrlFromOtherUrl = (url: string): string | undefined => {
  const baseURL = getBaseUrlFromOtherUrl(url)
  const repoFullName = getRepoFullNameFromUrl(url)

  return getRepoUrlFromFullName(repoFullName || '', { baseURL })
}

export const getRepoFullNameFromObject = (
  repo: GitHubRepo,
): string | undefined =>
  (repo &&
    ((repo.name && repo.name.includes('/') ? repo.name : undefined) ||
      (repo.full_name || getRepoFullNameFromUrl(repo.html_url || repo.url)))) ||
  undefined

export const getGitHubURLForUser = (
  username: string,
  {
    baseURL = defaultBaseURL,
    isBot,
  }: { baseURL?: string; isBot?: boolean } = {},
) => (username ? `${baseURL}/${isBot ? 'apps/' : ''}${username}` : undefined)

const objToQueryParams = (obj: { [key: string]: string | number }) =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')

export const getGitHubSearchURL = (
  queryParams: {
    [key: string]: string | number
  },
  { baseURL = defaultBaseURL }: { baseURL?: string } = {},
) => (queryParams ? `${baseURL}/search?${objToQueryParams(queryParams)}` : '')

export const getGitHubURLForBranch = (
  ownerName: string,
  repoName: string,
  branch: string,
  { baseURL = defaultBaseURL }: { baseURL?: string } = {},
) =>
  ownerName && repoName && branch
    ? `${baseURL}/${ownerName}/${repoName}/tree/${branch}`
    : undefined

export const getGitHubURLForRelease = (
  ownerName: string,
  repoName: string,
  tagName: string | undefined,
  { baseURL = defaultBaseURL }: { baseURL?: string } = {},
) =>
  ownerName && repoName
    ? tagName
      ? `${baseURL}/${ownerName}/${repoName}/releases/tag/${tagName}`
      : `${baseURL}/${ownerName}/${repoName}/releases`
    : ''

export const getGitHubURLForRepo = (
  ownerName: string,
  repoName: string,
  { baseURL = defaultBaseURL }: { baseURL?: string } = {},
) => (ownerName && repoName ? `${baseURL}/${ownerName}/${repoName}` : undefined)

export const getGitHubURLForRepoInvitation = (
  ownerName: string,
  repoName: string,
  { baseURL = defaultBaseURL }: { baseURL?: string } = {},
) =>
  ownerName && repoName ? `${baseURL}/${ownerName}/${repoName}/invitations` : ''

export const getGitHubURLForSecurityAlert = (repoURL: string | undefined) =>
  repoURL ? `${repoURL}/network/alerts` : undefined

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

export function appBottomAnchorIfPossible(uri: string, isMobile: boolean) {
  if (!uri) return ''

  const anchorId = isMobile ? 'bottom' : 'partial-timeline'
  return uri.includes('#') ? uri : `${uri}#${anchorId}`
}

export function githubHTMLUrlFromAPIUrl(
  apiURL: string,
  isMobile: boolean,
  {
    addBottomAnchor,
    baseURL = defaultBaseURL,
    commentId,
    commentIsInline,
    issueOrPullRequestNumber,
  }: GitHubURLOptions = {},
): string | undefined {
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
        case 'comments':
          return undefined

        case 'commits': {
          if (commentId) {
            return `${baseURL}/${repoFullName}/commit/${restOfURL2[0]}#${
              commentIsInline ? 'r' : 'commitcomment-'
            }${commentId}`
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

  return addBottomAnchor ? appBottomAnchorIfPossible(uri, isMobile) : uri
}

export function fixURLForPlatform(
  url: string,
  isMobile: boolean,
  options?: GitHubURLOptions,
) {
  if (!url) return ''

  // sometimes the url come like this: '/facebook/react', so we add https://github.com
  const baseURL = (options && options.baseURL) || defaultBaseURL
  let uri: string | undefined =
    url[0] === '/' && url.indexOf('github.com') < 0 ? `${baseURL}${url}` : url

  if (uri.indexOf('api.github.com') >= 0)
    uri = githubHTMLUrlFromAPIUrl(uri, isMobile, options)

  if (options && options.commentIsInline && uri)
    uri = uri.replace('commitcomment-', 'r')

  return options && options.addBottomAnchor && uri
    ? appBottomAnchorIfPossible(uri, isMobile)
    : uri
}
