/* eslint-disable import/prefer-default-export */

import qs from 'qs'

export const getUrlParamsIfMatches = (url, prefix) => {
  if (!url || typeof url !== 'string') return null

  if (url.startsWith(prefix)) {
    const query = url.replace(new RegExp(`^${prefix}[?]?`), '')
    return qs.parse(query)
  }

  return null
}
