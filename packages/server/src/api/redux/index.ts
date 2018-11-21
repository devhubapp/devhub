import axios from 'axios'
import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'

import { AllActions } from 'shared-core/dist/redux/types'

const sendReduxResponse = (
  res: ServerResponse,
  code: number,
  data: {
    action: AllActions
  },
) => send(res, code, data)

module.exports = async (req: IncomingMessage, res: ServerResponse) => {
  // res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'POST') {
    send(res, 404)
    return
  }

  let body
  try {
    body = await json(req)
  } catch (error) {
    send(res, 400, 'Invalid request. Required a valid JSON.')
    return
  }

  const { action } = (body || {}) as { action?: AllActions }

  if (!(action && action.type)) {
    send(
      res,
      400,
      'Invalid request. Required valid action field inside body object.',
    )
    return
  }

  switch (action.type) {
    case 'LOGIN_REQUEST': {
      try {
        const { data, status } = await axios.get(
          `https://api.github.com/user?access_token=${action.payload.token}`,
        )

        console.log('[REDUX][LOGIN_SUCCESS]', data.login) // tslint:disable-line

        sendReduxResponse(res, status, {
          action: {
            type: 'LOGIN_SUCCESS',
            payload: {
              user: data,
            },
          },
        })
        return
      } catch (error) {
        sendReduxResponse(res, error.response.status, {
          action: {
            type: 'LOGIN_FAILURE',
            payload: undefined,
            error: {
              code: error.response.status,
              message: error.response.data.message,
            },
          },
        })
        return
      }
    }

    default: {
      send(res, 400, 'Unknown action type.')
      return
    }
  }
}
