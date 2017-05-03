// @flow
/* eslint-disable import/prefer-default-export */

import Browser from '../../../libs/browser'
import { get } from '../../immutable'

import type { GithubIssue, GithubPullRequest, GithubRepo } from '../../types'

export const baseURL = 'https://github.com'

export function getCommentIdFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/comments\/([0-9]+)([?].+)?$/)
  return (matches && matches[1]) || null
}

export function getCommitShaFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/commits\/([a-zA-Z0-9]+)([?].+)?$/)
  return (matches && matches[1]) || null
}

export function getIssueOrPullRequestNumberFromUrl(url: string) {
  if (!url) return null

  const matches = url.match(/\/(issues|pulls)\/([0-9]+)([?].+)?$/)
  const number = matches && matches[2]

  return parseInt(number, 10) || number || null
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

export const getGitHubURLForUser = (user: string) =>
  user ? `${baseURL}/${user}` : ''

const objToQueryParams = obj =>
  Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')

export const getGitHubSearchURL = (queryParams: Object) =>
  queryParams ? `${baseURL}/search?${objToQueryParams(queryParams)}` : ''

export const getGitHubURLForBranch = (repoFullName: string, branch: string) =>
  repoFullName && branch ? `${baseURL}/${repoFullName}/tree/${branch}` : ''

export function githubHTMLUrlFromAPIUrl(
  apiURL: string,
  { number } = {},
): string {
  if (!apiURL) return ''

  const [, type, restOfURL] = apiURL.match('api.github.com/([a-zA-Z]+)/(.*)')
  if (!(type && restOfURL)) return ''

  if (type === 'repos') {
    const repoFullName = getRepoFullNameFromUrl(apiURL)
    const [
      type2,
      ...restOfURL2
    ] = (apiURL.split(`/repos/${repoFullName}/`)[1] || '').split('/')

    if (restOfURL2[0]) {
      switch (type2) {
        case 'commits':
          return `${baseURL}/${repoFullName}/commit/${restOfURL2.join('/')}`

        case 'issues':
          if (restOfURL2[0] === 'comments' && restOfURL2[1]) {
            return number
              ? `${baseURL}/${repoFullName}/pull/${number}/comments#issuecomment-${restOfURL2[1]}`
              : ''
          }

          return `${baseURL}/${repoFullName}/issues/${restOfURL2.join('/')}`

        case 'pulls':
          if (restOfURL2[0] === 'comments' && restOfURL2[1]) {
            return number
              ? `${baseURL}/${repoFullName}/pull/${number}/comments#discussion_r${restOfURL2[1]}`
              : ''
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

  return `${baseURL}/${restOfURL}`
}

function openURL(
  url: string,
  { safariOptions = {} }: { safariOptions: Object } = {},
) {
  if (!url) return

  // sometimes the url come like this: '/facebook/react', so we add https://github.com
  let uri = url[0] === '/' && url.indexOf('github.com') < 0
    ? `${baseURL}${url}`
    : url
  uri = uri.indexOf('api.github.com') >= 0 ? githubHTMLUrlFromAPIUrl(uri) : uri

  Browser.openURL(uri, safariOptions)
}

export function openOnGithub(
  obj: string | GithubRepo | GithubIssue | GithubPullRequest,
  options?: { safariOptions: Object },
) {
  if (!obj) return

  const uri = typeof obj === 'string'
    ? obj
    : get(obj, 'html_url') || get(obj, 'url')
  if (!uri) return

  openURL(uri, options || {})
}
