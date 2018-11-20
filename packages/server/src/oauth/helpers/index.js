const omit = require('lodash.omit')
const qs = require('qs')

exports.isLocalhost = host =>
  host.indexOf('localhost') >= 0 ||
  host.indexOf('0.0.0.0') >= 0 ||
  host.indexOf('127.0.0.1') >= 0

exports.getCurrentHostURL = req =>
  exports.isLocalhost(req.headers.host)
    ? `http://${req.headers.host.replace(/(0.0.0.0)|(127.0.0.1)/, 'localhost')}`
    : `https://${req.headers.host}`

exports.getDefaultCallbackURL = req =>
  `${exports.getCurrentHostURL(req)}/auth/github/callback`

exports.getCallbackURLWithQuery = (req, callbackUrl, query) => {
  return exports.mergeQueryWithURL(
    callbackUrl || exports.getDefaultCallbackURL(req),
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

exports.mergeQueryWithURL = (url, ...queryObjs) => {
  const [, urlWithoutQuery, queryStringFromURL] =
    (url || '').match(/([^?]+)[?]?(.*)/) || []
  const queryFromURL = qs.parse(queryStringFromURL)

  const mergedQuery = Object.assign({}, ...queryObjs, queryFromURL)
  const mergedQueryString = qs.stringify(mergedQuery) || ''

  return `${urlWithoutQuery || ''}?${mergedQueryString}`
}
