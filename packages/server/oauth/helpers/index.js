const omit = require('lodash.omit')
const qs = require('qs')

exports.mergeQueryWithURL = (url, ...queryObjs) => {
  const [, urlWithoutQuery, queryStringFromURL] =
    (url || '').match(/([^?]+)[?]?(.*)/) || []
  const queryFromURL = qs.parse(queryStringFromURL)

  const mergedQuery = Object.assign({}, ...queryObjs, queryFromURL)
  const mergedQueryString = qs.stringify(mergedQuery) || ''

  return `${urlWithoutQuery || ''}?${mergedQueryString}`
}
