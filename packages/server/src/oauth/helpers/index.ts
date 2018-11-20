import { Http2ServerRequest } from 'http2'
import omit from 'lodash.omit'
import qs from 'qs'
import { ParsedUrlQuery } from 'querystring'

export function isLocalhost(host: string) {
  if (!host) return ''

  return (
    host.indexOf('localhost') >= 0 ||
    host.indexOf('0.0.0.0') >= 0 ||
    host.indexOf('127.0.0.1') >= 0
  )
}

export function getCurrentHostURL(req: Http2ServerRequest) {
  const host = req.headers.host || ''

  return isLocalhost(host)
    ? `http://${host.replace(/(0.0.0.0)|(127.0.0.1)/, 'localhost')}`
    : `https://${host}`
}

export function getDefaultCallbackURL(req: Http2ServerRequest) {
  return `${getCurrentHostURL(req)}/auth/github/callback`
}

export function getCallbackURLWithQuery(
  req: Http2ServerRequest,
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
