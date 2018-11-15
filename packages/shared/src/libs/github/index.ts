import Octokit from '@octokit/rest'

import { GitHubActivityType } from '../../types'

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
  _params: Octokit.ActivityGetNotificationsParams & { headers?: any } = {},
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
    const response = await octokit.activity.getNotifications(params)

    cache[cacheKey] = {
      data: response.data,
      headers: response.headers,
      status: response.status,
    }

    return response
  } catch (error) {
    if (error && error.code === 304) return cache[cacheKey]
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
          return octokit.activity.getEventsForOrg(params)
        case 'PUBLIC_EVENTS':
          return octokit.activity.getEvents(params)
        case 'REPO_EVENTS':
          return octokit.activity.getEventsForRepo(params)
        case 'REPO_NETWORK_EVENTS':
          return octokit.activity.getEventsForRepoNetwork(params)
        case 'USER_EVENTS':
          return octokit.activity.getEventsForUser(params)
        case 'USER_ORG_EVENTS':
          return octokit.activity.getEventsForUserOrg(params)
        case 'USER_PUBLIC_EVENTS':
          return octokit.activity.getEventsForUserPublic(params)
        case 'USER_RECEIVED_EVENTS':
          return octokit.activity.getEventsReceived(params)
        case 'USER_RECEIVED_PUBLIC_EVENTS':
          return octokit.activity.getEventsReceivedPublic(params)
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
    if (error && error.code === 304) return cache[cacheKey]
    throw error
  }
}
