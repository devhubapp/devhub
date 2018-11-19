import qs from 'qs'

export interface OAuthResponseData {
  access_token?: string
  callback_url: string
  code: string
  scope: string[]
  token_type: string
}

export const getUrlParamsIfMatches = (
  url: string,
  prefix: string,
): OAuthResponseData | null => {
  if (!url || typeof url !== 'string') return null

  if (url.startsWith(prefix)) {
    const query = url.replace(new RegExp(`^${prefix}[?]?`), '')
    const params = qs.parse(query) || {}

    return {
      ...params,
      scope: (params.scope || '')
        .split(',')
        .map((scope: string) => `${scope || ''}`.trim())
        .filter(Boolean),
    }
  }

  return null
}
