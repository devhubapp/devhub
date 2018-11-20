const url = require('url')

const oauth = require('../../lib/oauth')
const { mergeQueryWithURL } = require('../../helpers')

module.exports = (req, res) => {
  req.query = url.parse(req.url, true).query

  oauth.callback(
    req,
    res,
    {
      PROVIDER: 'GitHub',
      CALLBACK_URL: req.query.callback_url || process.env.GITHUB_CALLBACK_URL,
      CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      GET_TOKEN_URL: 'https://github.com/login/oauth/access_token',
    },
    {
      grant_type: 'authorization_code',
    },
  )
}
