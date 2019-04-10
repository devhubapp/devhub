import Octokit, { SearchIssuesAndPullRequestsParams } from '@octokit/rest'

import {
  GitHubActivityType,
  IssueOrPullRequestColumnSubscription,
} from '@devhub/core'

export const octokit = new Octokit()

export function authenticate(token: string | null) {
  try {
    if (!token) {
      octokit.authenticate(null as any)
      return false
    }

    octokit.authenticate({
      type: 'oauth',
      token,
    })

    return true
  } catch (e) {
    return false
  }
}

const cache: Record<
  string,
  Pick<Octokit.AnyResponse, 'data' | 'headers' | 'status'>
> = {}

export async function getNotifications(
  params: (
    | Octokit.ActivityListNotificationsParams
    | Octokit.ActivityListNotificationsForRepoParams) & { headers?: any } = {},
  { subscriptionId = '', useCache = false } = {},
) {
  const cacheKey = JSON.stringify(['NOTIFICATIONS', params, subscriptionId])
  const cacheValue = cache[cacheKey]

  const _params = params || {}
  _params.headers = _params.headers || {}
  _params.headers['If-None-Match'] = ''

  // Note: GitHub notifications cache doesnt work as expected.
  // It keeps returning code 304 even if read status changed.
  // Thats why its disabled by default.
  if (cacheValue && useCache) {
    if (cacheValue.headers['last-modified']) {
      _params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      _params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  // So lets force an update
  if (!useCache) (_params as any).timestamp = Date.now()

  try {
    const response =
      'owner' in _params && _params.owner && _params.repo
        ? await octokit.activity.listNotificationsForRepo(_params)
        : await octokit.activity.listNotifications(_params)

    cache[cacheKey] = {
      data: response.data,
      headers: response.headers,
      status: response.status,
    }

    return cache[cacheKey]
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}

export async function getActivity<T extends GitHubActivityType>(
  type: T,
  params: any = {},
  { githubToken = '', subscriptionId = '', useCache = true } = {},
) {
  const cacheKey = JSON.stringify([type, params, subscriptionId])
  const cacheValue = cache[cacheKey]

  const _params = { ...params }
  _params.headers = _params.headers || {}
  _params.headers['If-None-Match'] = ''
  _params.headers.Accept = 'application/vnd.github.shadow-cat-preview'

  if (githubToken) {
    _params.headers.Authorization = `token ${githubToken}`
  }

  if (cacheValue && useCache) {
    if (cacheValue.headers['last-modified']) {
      _params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      _params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  try {
    const response = await (() => {
      switch (type) {
        case 'ORG_PUBLIC_EVENTS':
          return octokit.activity.listPublicEventsForOrg(_params)
        case 'PUBLIC_EVENTS':
          return octokit.activity.listPublicEvents(_params)
        case 'REPO_EVENTS':
          return octokit.activity.listRepoEvents(_params)
        case 'REPO_NETWORK_EVENTS':
          return octokit.activity.listPublicEventsForRepoNetwork(_params)
        case 'USER_EVENTS':
          return octokit.activity.listEventsForUser(_params)
        case 'USER_ORG_EVENTS':
          return octokit.activity.listEventsForOrg(_params)
        case 'USER_PUBLIC_EVENTS':
          return octokit.activity.listPublicEventsForUser(_params)
        case 'USER_RECEIVED_EVENTS':
          return octokit.activity.listReceivedEventsForUser(_params)
        case 'USER_RECEIVED_PUBLIC_EVENTS':
          return octokit.activity.listReceivedPublicEventsForUser(_params)
        default:
          throw new Error(
            `No api method configured for activity type '${type}'.`,
          )
      }
    })()

    cache[cacheKey] = {
      data: response.data,
      headers: response.headers,
      status: response.status,
    }

    return cache[cacheKey]
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}

export async function getIssuesOrPullRequests<
  T extends IssueOrPullRequestColumnSubscription['subtype']
>(
  type: T,
  params: any,
  { githubToken = '', subscriptionId = '', useCache = true } = {},
) {
  const cacheKey = JSON.stringify([type, params, subscriptionId])
  const cacheValue = cache[cacheKey]

  const _params: Record<string, any> & SearchIssuesAndPullRequestsParams = {
    ...params,
  }
  _params.headers = _params.headers || {}
  _params.headers['If-None-Match'] = ''
  _params.headers.Accept = 'application/vnd.github.shadow-cat-preview'

  if (githubToken) {
    _params.headers.Authorization = `token ${githubToken}`
  }

  if (cacheValue && useCache) {
    if (cacheValue.headers['last-modified']) {
      _params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      _params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  const { owner, repo } = _params

  try {
    const response = await (() => {
      switch (type) {
        case 'ISSUES': {
          _params.q = `repo:${owner}/${repo} is:issue`
          return octokit.search.issuesAndPullRequests(_params)
        }

        case 'PULLS': {
          _params.q = `repo:${owner}/${repo} is:pr`
          return octokit.search.issuesAndPullRequests(_params)
        }

        default: {
          throw new Error(
            `No api method configured for activity type '${type}'.`,
          )
        }
      }
    })()

    cache[cacheKey] = {
      data: response.data && response.data.items,
      headers: response.headers,
      status: response.status,
    }

    return cache[cacheKey]
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}
