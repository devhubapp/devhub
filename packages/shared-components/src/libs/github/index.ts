import Octokit from '@octokit/rest'

import { GitHubActivityType } from 'shared-core/dist/types'

export const octokit = new Octokit()

export function authenticate(token: string) {
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
  _params: Octokit.ActivityListNotificationsParams & { headers?: any } = {},
  { subscriptionId = '', useCache = false } = {},
) {
  const cacheKey = JSON.stringify(['NOTIFICATIONS', _params, subscriptionId])
  const cacheValue = cache[cacheKey]

  const params = _params || {}
  params.headers = params.headers || {}
  params.headers['If-None-Match'] = ''

  // Note: GitHub notifications cache doesnt work as expected.
  // It keeps returning code 304 even if read status changed.
  // Thats why its disabled by default.
  if (cacheValue && useCache) {
    if (cacheValue.headers['last-modified']) {
      params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  // So lets force an update
  if (!useCache) (params as any).timestamp = Date.now()

  try {
    const response = await octokit.activity.listNotifications(params)

    cache[cacheKey] = {
      data: response.data,
      headers: response.headers,
      status: response.status,
    }

    return response
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}

export async function getActivity<T extends GitHubActivityType>(
  type: T,
  _params: any = {},
  { subscriptionId = '', useCache = true } = {},
) {
  const cacheKey = JSON.stringify([type, _params, subscriptionId])
  const cacheValue = cache[cacheKey]

  const params = { ..._params }
  params.headers = params.headers || {}
  params.headers['If-None-Match'] = ''

  if (cacheValue && useCache) {
    if (cacheValue.headers['last-modified']) {
      params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    }

    if (cacheValue.headers.etag) {
      params.headers['If-None-Match'] = cacheValue.headers.etag
    }
  }

  try {
    const response = await (() => {
      switch (type) {
        case 'ORG_PUBLIC_EVENTS':
          return octokit.activity.listEventsForOrg(params)
        case 'PUBLIC_EVENTS':
          return octokit.activity.listPublicEvents(params)
        case 'REPO_EVENTS':
          return octokit.activity.listRepoEvents(params)
        case 'REPO_NETWORK_EVENTS':
          return octokit.activity.listPublicEventsForRepoNetwork(params)
        case 'USER_EVENTS':
          return octokit.activity.listEventsForUser(params)
        case 'USER_ORG_EVENTS':
          return octokit.activity.listEventsForOrg(params)
        case 'USER_PUBLIC_EVENTS':
          return octokit.activity.listPublicEventsForUser(params)
        case 'USER_RECEIVED_EVENTS':
          return octokit.activity.listReceivedEventsForUser(params)
        case 'USER_RECEIVED_PUBLIC_EVENTS':
          return octokit.activity.listReceivedPublicEventsForUser(params)
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

    return response
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}
