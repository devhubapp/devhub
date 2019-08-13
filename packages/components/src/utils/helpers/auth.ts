import qs from 'qs'

import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'

export function clearQueryStringFromURL(fields: string[]) {
  if (
    !(
      Platform.OS === 'web' &&
      !Platform.isElectron &&
      typeof window !== 'undefined' &&
      window.history &&
      window.history.replaceState &&
      window.location
    )
  )
    return

  const query = window.location.search.replace(new RegExp(`^[?]?`), '')
  const params = qs.parse(query)

  fields.forEach(field => {
    delete params[field]
  })

  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname || '/'}${
      Object.keys(params).length ? `?${qs.stringify(params)}` : ''
    }`,
  )
}

export function clearOAuthQueryParams() {
  Linking.clearCurrentURL()

  clearQueryStringFromURL([
    'app_token',
    'code',
    'github_app_type',
    'github_login',
    'github_scope',
    'github_token',
    'github_token_created_at',
    'github_token_type',
    'oauth',
  ])
}
