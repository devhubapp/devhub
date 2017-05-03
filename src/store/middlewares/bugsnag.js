import { bugsnagClient } from '../../utils/services'

export default () => next => action => {
  try {
    if (bugsnagClient) {
      bugsnagClient.leaveBreadcrumb('Redux', {
        type: 'state',
        action: action.type,
      })
    }
    next(action)
  } catch (error) {
    console.error(error)

    if (bugsnagClient) {
      bugsnagClient.notify(error, { action })
    }

    throw error
  }
}
