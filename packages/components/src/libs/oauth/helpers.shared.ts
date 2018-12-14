import { Omit } from '@devhub/core'
import qs from 'qs'

export interface OAuthResponseData {
  app_token?: string
  code: string
  github_scope: string[]
  github_token?: string
  github_token_created_at?: string
  github_token_type?: string
  oauth: boolean
}

export const getUrlParamsIfMatches = (
  url: string,
  prefix: string,
): OAuthResponseData | null => {
  if (!url || typeof url !== 'string') return null

  if (url.startsWith(prefix)) {
    const query = url.replace(new RegExp(`^${prefix}[?]?`), '')
    const params = (qs.parse(query) || {}) as Omit<
      OAuthResponseData,
      'github_scope' | 'oauth'
    > & {
      github_scope?: string
      oauth?: string | boolean
    }

    return {
      ...params,
      github_scope: (params.github_scope || '')
        .replace(/,/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((scope: string) => `${scope || ''}`.trim())
        .filter(Boolean),
      oauth: params.oauth === true || params.oauth === 'true',
    }
  }

  return null
}
