import {
  getGitHubIssueSearchQuery,
  GitHubActivityType,
  IssueOrPullRequestColumnSubscription,
} from '@devhub/core'
import { Octokit } from '@octokit/rest'
import _ from 'lodash'

import { enableOctokitNetworkInterceptor } from '../../network-interceptor'

const _defaultGitHubToken = new Octokit()
const _octokitByToken = new Map<string, typeof _defaultGitHubToken>()

export function getOctokitForToken(token: string | null) {
  if (token && !_octokitByToken.has(token)) {
    const newOctokit = new Octokit({ auth: token })
    enableOctokitNetworkInterceptor(newOctokit)
    _octokitByToken.set(token, newOctokit)
  }

  const octokit = _octokitByToken.get(token || 'none')
  return octokit || _defaultGitHubToken
}

export function clearOctokitInstances() {
  _octokitByToken.clear()
}

const cache: Record<
  string,
  Pick<Octokit.AnyResponse, 'data' | 'headers' | 'status'>
> = {}

export async function getNotifications(
  params: (
    | Octokit.ActivityListNotificationsParams
    | Octokit.ActivityListNotificationsForRepoParams
  ) & { headers?: any } = {},
  {
    githubToken,
    subscriptionId = '',
    useCache = false,
  }: {
    githubToken: string
    subscriptionId?: string
    useCache?: boolean
  },
) {
  const cacheKey = JSON.stringify([
    'NOTIFICATIONS',
    params,
    subscriptionId,
    githubToken,
  ])
  const cacheValue = cache[cacheKey]

  const _params = cleanupObject(params)
  _params.headers = _params.headers || {}
  _params.headers['If-None-Match'] = ''

  // Note: GitHub notifications cache doesnt work as expected.
  // It keeps returning code 304 even if read status changed.
  // Thats why its disabled by default.
  if (useCache) {
    if (_params.since) {
      _params.headers['If-Modified-Since'] = _params.since
    }
  }
  if (cacheValue && useCache) {
    if (
      cacheValue.headers['last-modified'] &&
      !_params.headers['If-Modified-Since']
    ) {
      _params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      _params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  // So lets force an update
  if (!useCache) (_params as any).timestamp = Date.now()

  try {
    const octokit = getOctokitForToken(githubToken)

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
  {
    githubToken,
    subscriptionId = '',
    useCache = true,
  }: {
    githubToken: string
    subscriptionId?: string
    useCache?: boolean
  },
) {
  const cacheKey = JSON.stringify([type, params, subscriptionId, githubToken])
  const cacheValue = cache[cacheKey]

  const _params = cleanupObject(params)
  _params.headers = _params.headers || {}
  _params.headers['If-None-Match'] = ''
  _params.headers.Accept =
    'application/vnd.github.shadow-cat-preview,application/vnd.github.v3+json'

  if (useCache) {
    if (_params.since) {
      _params.headers['If-Modified-Since'] = _params.since
    }
  }

  if (cacheValue && useCache) {
    if (
      cacheValue.headers['last-modified'] &&
      !_params.headers['If-Modified-Since']
    ) {
      _params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      _params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  try {
    const response = await (() => {
      const octokit = getOctokitForToken(githubToken)

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
  subscriptionParams: IssueOrPullRequestColumnSubscription['params'],
  requestParams: Omit<Octokit.SearchIssuesAndPullRequestsParams, 'q'> & {
    headers?: Record<string, string>
    since?: string
  },
  {
    githubToken,
    subscriptionId = '',
    useCache = true,
  }: {
    githubToken: string
    subscriptionId?: string
    useCache?: boolean
  },
) {
  const cacheKey = JSON.stringify([
    type,
    { subscriptionParams, requestParams },
    subscriptionId,
    githubToken,
  ])
  const cacheValue = cache[cacheKey]

  const _params = cleanupObject(requestParams)
  _params.headers = {
    ..._params.headers,
    'If-None-Match': '',
    Accept:
      'application/vnd.github.shadow-cat-preview,application/vnd.github.v3+json',
  }

  if (useCache) {
    if (_params.since) {
      _params.headers['If-Modified-Since'] = _params.since
    }
  }

  if (cacheValue && useCache) {
    if (
      cacheValue.headers['last-modified'] &&
      !_params.headers['If-Modified-Since']
    ) {
      _params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      _params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  try {
    const response = await (() => {
      const octokit = getOctokitForToken(githubToken)

      const p: Octokit.SearchIssuesAndPullRequestsParams & {
        headers?: Record<string, string>
      } = {
        ..._.omit(_params, Object.keys(subscriptionParams)),
        q: getGitHubIssueSearchQuery(subscriptionParams),
      }

      return octokit.search.issuesAndPullRequests(p)
    })()

    cache[cacheKey] = {
      data: Array.isArray(response.data)
        ? response.data
        : response.data && response.data.items,
      headers: response.headers,
      status: response.status,
    }

    return cache[cacheKey]
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}

export function cleanupObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj }

  Object.entries(obj).forEach(([key, value]) => {
    if (
      value === 'undefined' ||
      typeof value === 'undefined' ||
      value === undefined ||
      value === 'null' ||
      value === null
    ) {
      delete result[key]
    }
  })

  return result
}
