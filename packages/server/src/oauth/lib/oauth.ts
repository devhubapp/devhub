import axios from 'axios'
import { IncomingMessage, ServerResponse } from 'http'
import qs from 'qs'

import { mergeQueryWithURL } from '../helpers'

const redirectUsingHTML = (
  res: ServerResponse,
  _statusCode: number,
  url: string,
) => {
  // res.writeHead(statusCode || 302, { 'content-type': 'text/html' })
  res.end(
    `<!DOCTYPE html>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content=${JSON.stringify(`0;URL=${url}`)} />
    <title>Redirecting...</title>
    <script>window.location=${JSON.stringify(url)}</script>`,
  )
}

const redirectUsingHTMLAndPostMessage = (
  res: ServerResponse,
  _statusCode: number,
  url: string,
) => {
  // res.writeHead(statusCode || 302, { 'content-type': 'text/html' })
  res.end(
    `<!DOCTYPE html>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <script>
      function getQueryParameters(str) {
        var _str = str || document.location.search || '';
        return (_str[0] === '?' ? _str.slice(1) : _str.replace(${/[^\?]+[\?]?/}, '')).split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
      }

      var query = getQueryParameters(${JSON.stringify(url)});
      var hasValidCallbackURL = ${
        url.match(/[^?]+[?]/) ? 'true' : 'false'
      } && query.callback_url;

      if (typeof (window.opener || {}).postMessage === 'function') {
        var origin = decodeURIComponent(query.origin || '*');
        window.opener.postMessage(query, origin);

        if (!hasValidCallbackURL && window.close) window.close();
      }

      if (hasValidCallbackURL)
        window.location=${JSON.stringify(url)}
      else if (window.opener)
        window.close()
      else
        alert('No callback url was specified.')
    </script>`,
  )
}

export function authorize(
  req: IncomingMessage,
  res: ServerResponse,
  { AUTHORIZE_URL }: { AUTHORIZE_URL: string },
  query?: object,
) {
  redirectUsingHTML(res, 302, mergeQueryWithURL(AUTHORIZE_URL, query || {}))
}

export async function callback(
  req: IncomingMessage,
  res: ServerResponse,
  {
    CALLBACK_URL,
    CLIENT_ID,
    CLIENT_SECRET,
    GET_TOKEN_URL,
    PROVIDER = 'OAuth provider',
  }: {
    CALLBACK_URL: string
    CLIENT_ID: string
    CLIENT_SECRET: string
    GET_TOKEN_URL: string
    PROVIDER: string
  },
  _query: object = {},
  _callback: (error: any, data: any) => void = () => undefined,
) {
  const { code }: any = _query || {}

  const redirectWithData = (statusCode: number, data: any) => {
    if (_callback) _callback(data.error || null, data.error ? null : data)

    const query = Object.assign({}, _query, data)
    query.callback_url = query.callback_url || CALLBACK_URL

    const url = mergeQueryWithURL(CALLBACK_URL, query)
    redirectUsingHTMLAndPostMessage(res, statusCode, url)
  }

  if (!code) {
    redirectWithData(401, { error: 'Provide code query param' })
    return
  }

  try {
    const { status, data } = await axios.post(
      GET_TOKEN_URL,
      qs.stringify(
        Object.assign(
          {},
          {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
          },
          _query,
        ),
      ),
    )

    if (status === 200 && data) {
      const result = typeof data === 'object' ? data : qs.parse(data)

      if (result.error) {
        redirectWithData(401, { error: result.error_description })
      } else {
        result.access_token = result.access_token || undefined
        redirectWithData(200, result)
      }
    } else {
      redirectWithData(500, { error: `${PROVIDER} server error.` })
    }
  } catch (err) {
    console.error('err', err)
    const statusCode = (((err || {}).response || {}).data || {}).code || 500
    const message =
      (((err || {}).response || {}).data || {}).error_message ||
      `Please provide CALLBACK_URL, CLIENT_ID, CLIENT_SECRET and GET_TOKEN_URL variables. (or ${PROVIDER} might be down)`

    redirectWithData(statusCode, { error: message })
  }
}
