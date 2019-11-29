import { constants, User } from '@devhub/core'
import axios, { AxiosResponse } from 'axios'
import * as StoreReview from 'react-native-store-review'
import { REHYDRATE } from 'redux-persist'
import {
  all,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects'

import { analytics } from '../../libs/analytics'
import { bugsnag } from '../../libs/bugsnag'
import * as github from '../../libs/github'
import { getDefaultDevHubHeaders } from '../../utils/api'
import { clearOAuthQueryParams } from '../../utils/helpers/auth'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { RootState } from '../types'
import { ExtractActionFromActionCreator } from '../types/base'

function* init() {
  yield take('LOGIN_SUCCESS')

  while (true) {
    const state = yield select()

    const appToken = selectors.appTokenSelector(state)
    const isLogged = selectors.isLoggedSelector(state)
    const user = selectors.currentUserSelector(state)
    if (!(appToken && isLogged && user)) yield take('LOGIN_SUCCESS')
    if (!(appToken && isLogged && user && user.lastLoginAt)) continue

    const plan = selectors.currentUserPlanSelector(state)

    // reload the page every 48 hours (to avoid getting super old [web] versions still being used)
    if (
      window &&
      window.location &&
      window.location.reload &&
      Date.now() - new Date(user.lastLoginAt).getTime() > 1000 * 60 * 60 * 48
    ) {
      window.location.reload()
    }

    // dispatch a login request every 12 hours
    else if (
      Date.now() - new Date(user.lastLoginAt).getTime() >
      1000 * 60 * 60 * 12
    ) {
      yield put(actions.loginRequest({ appToken }))
    }

    // dispatch a login request if plan just expired
    else if (
      plan &&
      plan.trialEndAt &&
      Date.now() >= new Date(plan.trialEndAt).getTime() &&
      Date.now() - new Date(plan.trialEndAt).getTime() < 1000 * 60 * 5
    ) {
      yield put(actions.loginRequest({ appToken }))
      yield delay(1000 * 60 * 1)
      continue
    }

    // if plan will expire in the next hour, use this time diff as delay
    if (
      plan &&
      plan.trialEndAt &&
      new Date(plan.trialEndAt).getTime() > Date.now() &&
      new Date(plan.trialEndAt).getTime() - Date.now() < 1000 * 60 * 60
    ) {
      yield delay(Date.now() - new Date(plan.trialEndAt).getTime() + 100)
    } else {
      yield delay(1000 * 60 * 60) // 1 hour
    }
  }
}

function* onRehydrate() {
  const appToken = yield select(selectors.appTokenSelector)
  if (!appToken) return

  yield put(actions.loginRequest({ appToken }))
}

function* onLoginRequest(
  action: ExtractActionFromActionCreator<typeof actions.loginRequest>,
) {
  const { appToken } = action.payload

  try {
    // TODO: Auto generate these typings
    const response: AxiosResponse<{
      data: {
        login: {
          appToken: string
          columns?: RootState['columns']
          subscriptions?: RootState['subscriptions']
          user: {
            _id: User['_id']
            github: {
              app?: User['github']['app']
              oauth?: User['github']['oauth']
              user: {
                id: User['github']['user']['id']
                nodeId: User['github']['user']['nodeId']
                login: User['github']['user']['login']
                name: User['github']['user']['name']
                avatarUrl: User['github']['user']['avatarUrl']
                createdAt: User['github']['user']['createdAt']
                updatedAt: User['github']['user']['updatedAt']
              }
            }
            plan: User['plan']
            createdAt: User['createdAt']
            updatedAt: User['updatedAt']
            lastLoginAt: User['lastLoginAt']
          }
        } | null
      }
      errors?: any[]
    }> = yield axios.post(
      constants.GRAPHQL_ENDPOINT,
      {
        query: `query auth {
          login {
            appToken
            user {
              _id
              columns
              subscriptions
              github {
                app {
                  scope
                  token
                  tokenType
                  tokenCreatedAt
                }
                oauth {
                  scope
                  token
                  tokenType
                  tokenCreatedAt
                }
                user {
                  id
                  nodeId
                  login
                  name
                  avatarUrl
                }
              }
              freeTrialStartAt
              freeTrialEndAt
              plan {
                id
                source
                type

                stripeIds
                paddleId
                
                banner

                amount
                currency
                trialPeriodDays
                interval
                intervalCount
                label
                transformUsage {
                  divideBy
                  round
                }
                quantity

                status

                startAt
                cancelAt
                cancelAtPeriodEnd

                trialStartAt
                trialEndAt

                currentPeriodStartAt
                currentPeriodEndAt

                last4
                reason
                users

                featureFlags {
                  columnsLimit
                  enableFilters
                  enableSync
                  enablePrivateRepositories
                  enablePushNotifications
                }

                createdAt
                updatedAt
              }
              createdAt
              updatedAt
              lastLoginAt
            }
          }
        }`,
      },
      {
        headers: getDefaultDevHubHeaders({ appToken }),
      },
    )

    const { data, errors } = response.data

    if (errors && errors.length) {
      throw Object.assign(new Error('GraphQL Error'), { response })
    }

    if (
      !(
        data &&
        data.login &&
        data.login.appToken &&
        data.login.user &&
        data.login.user.github &&
        data.login.user.github &&
        data.login.user.github.user &&
        data.login.user.github.user.id
      )
    ) {
      throw new Error('Invalid response')
    }

    yield put(
      actions.loginSuccess({
        appToken: data.login.appToken,
        user: data.login.user,
      }),
    )
  } catch (error) {
    const description = 'Login failed'
    bugsnag.notify(error, { description })
    console.error(description, error)

    yield put(
      actions.loginFailure(
        error &&
          error.response &&
          error.response.data &&
          error.response.data.errors &&
          error.response.data.errors[0],
      ),
    )
  }
}

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  clearOAuthQueryParams()

  if (StoreReview.isAvailable) {
    const state = yield select()
    const { loginSuccess: loginCount } = selectors.countersSelector(state)

    if (loginCount >= 5 && loginCount % 5 === 0) {
      StoreReview.requestReview()
    }
  }
}

function* updateLoggedUserOnTools() {
  const state = yield select()

  const preferredDarkThemePair = selectors.preferredDarkThemePairSelector(state)
  const preferredLightThemePair = selectors.preferredLightThemePairSelector(
    state,
  )
  const themePair = selectors.themePairSelector(state)
  const user = selectors.currentUserSelector(state)

  const githubUser = selectors.currentGitHubUserSelector(state)
  const githubOAuthToken = selectors.githubOAuthTokenSelector(state)
  const githubAppToken = selectors.githubAppTokenSelector(state)
  const plan = selectors.currentUserPlanSelector(state)

  github.authenticate(githubOAuthToken || githubAppToken || null)

  analytics.setUser(user && user._id)
  analytics.setDimensions({
    dark_theme_id: preferredDarkThemePair.id,
    light_theme_id: preferredLightThemePair.id,
    plan_amount: (plan && plan.amount) || 0,
    theme_id: themePair.id,
  })
  bugsnag.setUser(
    (user && user._id) || '',
    (githubUser && (githubUser.login || githubUser.name || githubUser.id)) ||
      '',
  )
}

function* onLoginFailure(
  action: ExtractActionFromActionCreator<typeof actions.loginFailure>,
) {
  if (
    action.error &&
    (action.error.status === 401 ||
      (action.error.response &&
        (action.error.response.status === 401 ||
          (action.error.response.data &&
            Array.isArray(action.error.response.data.errors) &&
            action.error.response.data.errors.some(
              (e: any) =>
                e.extensions && e.extensions.code === 'UNAUTHENTICATED',
            )))))
  ) {
    yield put(actions.logout())
  }
}

function onLogout() {
  github.authenticate('')
  clearOAuthQueryParams()
}

function* onDeleteAccountRequest() {
  const appToken = yield select(selectors.appTokenSelector)

  try {
    const response: AxiosResponse<{
      data: {
        deleteAccount: boolean | null
      }
      errors?: any[]
    }> = yield axios.post(
      constants.GRAPHQL_ENDPOINT,
      {
        query: `mutation {
          deleteAccount
        }`,
      },
      {
        headers: getDefaultDevHubHeaders({ appToken }),
      },
    )

    const { data, errors } = response.data

    if (errors && errors.length) {
      throw Object.assign(new Error('GraphQL Error'), { response })
    }

    if (!(data && typeof data.deleteAccount === 'boolean')) {
      throw new Error('Invalid response')
    }

    if (!(data && data.deleteAccount)) {
      throw new Error('Failed to delete account')
    }

    yield put(actions.deleteAccountSuccess())
  } catch (error) {
    const description = 'Delete account failed'
    bugsnag.notify(error, { description })
    console.error(description, error)

    yield put(
      actions.deleteAccountFailure(
        error &&
          error.response &&
          error.response.data &&
          error.response.data.errors &&
          error.response.data.errors[0],
      ),
    )
  }
}

function onDeleteAccountFailure(
  action: ExtractActionFromActionCreator<typeof actions.deleteAccountFailure>,
) {
  bugsnag.notify(action.error)
  alert(
    `Oops. Failed to delete account. Please try again.\n\n${(action.error &&
      action.error.message) ||
      action.error ||
      ''}`.trim(),
  )
}

function* onDeleteAccountSuccess() {
  yield put(actions.logout())
}

export function* authSagas() {
  yield all([
    yield fork(init),
    yield takeLatest(REHYDRATE, onRehydrate),
    yield takeLatest(
      [REHYDRATE, 'LOGIN_SUCCESS', 'LOGOUT', 'UPDATE_USER_DATA'],
      updateLoggedUserOnTools,
    ),
    yield takeLatest('LOGIN_REQUEST', onLoginRequest),
    yield takeLatest('LOGIN_FAILURE', onLoginFailure),
    yield takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    yield takeLatest('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
    yield takeLatest('DELETE_ACCOUNT_FAILURE', onDeleteAccountFailure),
    yield takeLatest('DELETE_ACCOUNT_SUCCESS', onDeleteAccountSuccess),
    yield takeLatest('LOGOUT', onLogout),
  ])
}
