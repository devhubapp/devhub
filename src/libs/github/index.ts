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

const cache: Record<string, Pick<Octokit.AnyResponse, 'headers'>> = {}

export async function getNotifications(
  _params: Octokit.ActivityGetNotificationsParams = {},
) {
  // const cacheKey = JSON.stringify(['NOTIFICATIONS', _params])
  // const cacheValue = cache[cacheKey]

  const params = (_params || {}) as any
  params.headers = params.headers || {}
  params.headers['If-None-Match'] = ''

  // if (cacheValue) {
  //   params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
  //   params.headers['If-None-Match'] = cacheValue.headers.etag
  // }

  const response = await octokit.activity.getNotifications(params)

  // cache[cacheKey] = {
  //   headers: response.headers,
  // }

  return response
}

export async function getActivity<T extends GitHubActivityType>(
  type: T,
  _params: any = {},
) {
  const cacheKey = JSON.stringify([type, _params])
  const cacheValue = cache[cacheKey]

  const params = { ..._params }
  params.headers = params.headers || {}
  params.headers['If-None-Match'] = ''

  if (cacheValue) {
    params.headers['If-Modified-Since'] = cacheValue.headers['last-modified']
    params.headers['If-None-Match'] = cacheValue.headers.etag
  }

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
        throw new Error(`No api method configured for activity type '${type}'.`)
    }
  })()

  cache[cacheKey] = {
    headers: response.headers,
  }

  return response
}
