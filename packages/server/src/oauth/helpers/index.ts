import { IncomingMessage } from 'http'
import omit from 'lodash.omit'
import qs from 'qs'
import { ParsedUrlQuery } from 'querystring'

export function getDefaultCallbackURL(req: IncomingMessage) {
  return `https://devhubapp.com/auth/github/callback`
}

export function getCallbackURLWithQuery(
  req: IncomingMessage,
  callbackUrl?: string,
  query?: object,
) {
  return mergeQueryWithURL(
    callbackUrl || getDefaultCallbackURL(req),
    omit(query || {}, [
      'client_id',
      'code',
      'grant_type',
      'redirect_uri',
      'response_type',
      'scope',
    ]),
  )
}

export function mergeQueryWithURL(url: string, ...queryObjs: object[]) {
  const [, urlWithoutQuery, queryStringFromURL] =
    (url || '').match(/([^?]+)[?]?(.*)/) || ([] as string[])
  const queryFromURL = qs.parse(queryStringFromURL)

  const mergedQuery = Object.assign({}, ...queryObjs, queryFromURL)
  const mergedQueryString = qs.stringify(mergedQuery) || ''

  return `${urlWithoutQuery || ''}?${mergedQueryString}`
}

export function getFirstStringFromQuery(query: ParsedUrlQuery, field: string) {
  return Array.isArray(query[field])
    ? query[field][0]
    : (query[field] as string | undefined)
}
