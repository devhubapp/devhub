const url = require('url')

const oauth = require('../../lib/oauth')
const {
  getCallbackURLWithQuery,
  getDefaultCallbackURL,
  mergeQueryWithURL,
} = require('../../helpers')

module.exports = (req, res) => {
  req.query = url.parse(req.url, true).query

  oauth.authorize(
    req,
    res,
    {
      AUTHORIZE_URL: 'https://github.com/login/oauth/authorize',
    },
    Object.assign({}, req.query, {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: getCallbackURLWithQuery(
        req,
        req.query.redirect_uri || getDefaultCallbackURL(req),
        req.query,
      ),
      response_type: 'code',
    }),
  )
}
