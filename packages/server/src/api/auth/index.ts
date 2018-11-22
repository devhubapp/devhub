import axios from 'axios'
import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'

module.exports = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    send(res, 200)
    return
  }

  if (req.method !== 'POST') {
    send(res, 404)
    return
  }

  let body: { githubToken: string }
  try {
    body = (await json(req)) as any
  } catch (error) {
    send(res, 400, 'Invalid request. Required a valid JSON.')
    return
  }

  if (!(body && body.githubToken)) {
    send(res, 400, 'Invalid request. Required body param: githubToken.')
    return
  }

  let response
  try {
    response = await axios.get(
      `https://api.github.com/user?access_token=${body.githubToken}`,
    )
  } catch (error) {
    send(res, error.response.status, {
      code: error.response.status,
      message: error.response.data.message,
    })
    return
  }

  const { data, status } = response

  if (!(data && data.login)) {
    send(res, 500, {
      code: 500,
      message: 'Invalid response',
    })
    return
  }

  console.log('[LOGIN_SUCCESS]', data.login) // tslint:disable-line

  send(res, status || 200, {
    user: data,
  })
}
