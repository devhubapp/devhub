import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import url from 'url'

import {
  getCallbackURLWithQuery,
  getDefaultCallbackURL,
  getFirstStringFromQuery,
} from '../../helpers'
import { authorize } from '../../lib/oauth'

module.exports = (req: Http2ServerRequest, res: Http2ServerResponse) => {
  const query = url.parse(req.url, true).query || {}
  const redirectUri = getFirstStringFromQuery(query, 'redirect_uri')

  authorize(
    req,
    res,
    {
      AUTHORIZE_URL: 'https://github.com/login/oauth/authorize',
    },
    Object.assign({}, query, {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: getCallbackURLWithQuery(
        req,
        redirectUri || getDefaultCallbackURL(req),
        query,
      ),
      response_type: 'code',
    }),
  )
}
