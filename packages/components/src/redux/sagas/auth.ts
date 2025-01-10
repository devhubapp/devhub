import { constants, User, GitHubTokenDetails } from '@devhub/core'
import axios, { AxiosResponse, AxiosError } from 'axios'
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
} from 'typed-redux-saga'

import { Alert } from 'react-native'
import { analytics } from '../../libs/analytics'
import { bugsnag } from '../../libs/bugsnag'
import * as github from '../../libs/github'
import { getDefaultDevHubHeaders } from '../../utils/api'
import { clearOAuthQueryParams } from '../../utils/helpers/auth'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { RootState } from '../types'
import { ExtractActionFromActionCreator } from '../types/base'
import { AuthError } from '../reducers/auth'

interface GraphQLErrorResponse extends Error {
  response: {
    data: {
      errors: Array<{
        message: string
      }>
    }
    status: number
  }
}

interface GraphQLResponse<T = any> {
  data: T
  status: number
  errors?: Array<{
    message: string
  }>
}

interface GraphQLErrorObject {
  response: {
    data: {
      errors: Array<{
        message: string
      }>
    }
    status: number
  }
}

function createGraphQLError(
  message: string,
  response: GraphQLResponse,
): GraphQLErrorResponse {
  const error = new Error(message) as GraphQLErrorResponse
  error.response = {
    data: {
      errors: response.errors || [{ message: 'Unknown GraphQL error' }],
    },
    status: response.status,
  }
  return error
}

function isGraphQLErrorResponse(error: unknown): error is GraphQLErrorResponse {
  if (!error || typeof error !== 'object') return false

  const errorObj = error as GraphQLErrorObject
  return !!(
    errorObj.response &&
    typeof errorObj.response === 'object' &&
    errorObj.response.data &&
    typeof errorObj.response.data === 'object' &&
    errorObj.response.data.errors &&
    Array.isArray(errorObj.response.data.errors) &&
    typeof errorObj.response.status === 'number'
  )
}

function* init() {
  yield take('LOGIN_SUCCESS')

  while (true) {
    const state = yield* select()

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
  const appToken = yield* select(selectors.appTokenSelector)
  if (!appToken) return

  yield put(actions.loginRequest({ appToken }))
}

function* onLoginRequest(
  action: ExtractActionFromActionCreator<typeof actions.loginRequest>,
): Generator<any, void, any> {
  const { appToken } = action.payload

  try {
    if (constants.LOCAL_ONLY_PERSONAL_ACCESS_TOKEN) {
      // For local-only mode, we'll use the GitHub API directly
      const octokit = github.getOctokitForToken(appToken)
      const response = yield octokit.users.getAuthenticated()

      if (!response.data) {
        throw new Error('Invalid response from GitHub API')
      }

      const user: User = {
        _id: `github_${response.data.id}`,
        github: {
          personal: {
            token: appToken,
            scope: ['repo'],
            tokenType: 'bearer',
            tokenCreatedAt: new Date().toISOString(),
            login: response.data.login,
          } as GitHubTokenDetails,
          user: {
            id: response.data.id,
            nodeId: response.data.node_id,
            login: response.data.login,
            name: response.data.name || response.data.login,
            avatarUrl: response.data.avatar_url,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at,
          },
        },
        plan: {
          id: 'free',
          source: 'none' as const,
          type: undefined,
          status: 'active',
          amount: 0,
          currency: 'usd',
          trialPeriodDays: 0,
          intervalCount: 0,
          label: 'Free',
          interval: undefined,
          quantity: undefined,
          startAt: new Date().toISOString(),
          cancelAt: undefined,
          cancelAtPeriodEnd: false,
          trialStartAt: undefined,
          trialEndAt: undefined,
          currentPeriodStartAt: new Date().toISOString(),
          currentPeriodEndAt: undefined,
          last4: undefined,
          reason: undefined,
          users: undefined,
          featureFlags: {
            columnsLimit: constants.LOCAL_ONLY_PERSONAL_ACCESS_TOKEN ? 999 : -1,
            enableFilters: true,
            enableSync: false,
            enablePrivateRepositories: true,
            enablePushNotifications: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }

      yield put(actions.loginSuccess({ appToken, user }))
      return
    }

    // Original code for non-local mode
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
              personal?: User['github']['personal']
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
                personal {
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
              plan {
                id
                source
                type
                stripeIds
                paddleProductId
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
                coupon
                dealCode
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
      throw createGraphQLError('GraphQL Error', {
        data: response.data,
        status: response.status,
        errors: errors,
      })
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

    yield put(actions.loginSuccess({ appToken, user: data.login.user }))
  } catch (error) {
    console.error('Login failed', error)
    const err = error instanceof Error ? error : new Error('Unknown error')
    bugsnag.notify(err)

    const authError: AuthError = {
      name: err.name,
      message: err.message,
      status: isGraphQLErrorResponse(error) ? error.response.status : undefined,
      response: isGraphQLErrorResponse(error) ? error.response.data : undefined,
    }

    yield put(actions.loginFailure(authError))
  }
}

function* onLoginSuccess(
  _action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  clearOAuthQueryParams()

  if (StoreReview.isAvailable && !__DEV__) {
    const state = yield* select()
    const { loginSuccess: loginCount } = selectors.countersSelector(state)

    if (loginCount >= 5 && loginCount % 5 === 0) {
      StoreReview.requestReview()
    }
  }

  yield put(actions.cleanupArchivedItems())
}

function* updateLoggedUserOnTools() {
  const state = yield* select()

  const preferredDarkThemePair = selectors.preferredDarkThemePairSelector(state)
  const preferredLightThemePair =
    selectors.preferredLightThemePairSelector(state)
  const themePair = selectors.themePairSelector(state)
  const user = selectors.currentUserSelector(state)

  const githubUser = selectors.currentGitHubUserSelector(state)
  const plan = selectors.currentUserPlanSelector(state)

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
  github.clearOctokitInstances()
  clearOAuthQueryParams()
}

function* onDeleteAccountRequest() {
  const appToken = yield* select(selectors.appTokenSelector)

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
      throw createGraphQLError('GraphQL Error', {
        data: response.data,
        status: response.status,
        errors: errors,
      })
    }

    if (!(data && typeof data.deleteAccount === 'boolean')) {
      throw new Error('Invalid response')
    }

    if (!(data && data.deleteAccount)) {
      throw new Error('Failed to delete account')
    }

    yield put(actions.deleteAccountSuccess())
  } catch (error) {
    console.error('Delete account failed', error)
    const err = error instanceof Error ? error : new Error('Unknown error')
    bugsnag.notify(err)

    const deleteError = isGraphQLErrorResponse(error)
      ? error
      : new Error(err.message)

    yield put(actions.deleteAccountFailure(deleteError))
  }
}

function onDeleteAccountFailure(
  action: ExtractActionFromActionCreator<typeof actions.deleteAccountFailure>,
) {
  bugsnag.notify(action.error)
  Alert.alert(
    'Oops.',
    `Failed to delete account. Please try again.\n\n${
      (action.error && action.error.message) || action.error || ''
    }`.trim(),
  )
}

function* onDeleteAccountSuccess() {
  yield put(actions.logout())
}

export function* authSagas() {
  yield* all([
    yield* takeLatest('LOGIN_REQUEST', onLoginRequest),
    yield* takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    yield* takeLatest('LOGIN_FAILURE', onLoginFailure),
    yield* takeLatest('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
    yield* takeLatest('DELETE_ACCOUNT_SUCCESS', onDeleteAccountSuccess),
    yield* takeLatest('DELETE_ACCOUNT_FAILURE', onDeleteAccountFailure),
    yield* takeLatest('LOGOUT', onLogout),
    yield* takeLatest(REHYDRATE as any, onRehydrate),
    yield* takeLatest(
      [REHYDRATE, 'LOGIN_SUCCESS', 'LOGOUT', 'UPDATE_USER_DATA'],
      updateLoggedUserOnTools,
    ),
    yield* fork(init),
  ])
}
