import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import url from 'url'

import { getFirstStringFromQuery } from '../../helpers'
import { callback } from '../../lib/oauth'

module.exports = (req: Http2ServerRequest, res: Http2ServerResponse) => {
  const query = url.parse(req.url, true).query || {}
  const callbackUrl = getFirstStringFromQuery(query, 'callback_url')

  callback(
    req,
    res,
    {
      PROVIDER: 'GitHub',
      CALLBACK_URL: callbackUrl || process.env.GITHUB_CALLBACK_URL || '',
      CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
      CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
      GET_TOKEN_URL: 'https://github.com/login/oauth/access_token',
    },
    Object.assign(
      {},
      {
        grant_type: 'authorization_code',
      },
      query,
    ),
  )
}
