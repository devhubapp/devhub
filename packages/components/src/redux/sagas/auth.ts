import axios, { AxiosResponse } from 'axios'
import { REHYDRATE } from 'redux-persist'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import { constants, fromGitHubUser, GitHubUser, User } from '@devhub/core'
import { analytics } from '../../libs/analytics'
import { bugsnag } from '../../libs/bugsnag'
import * as github from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { RootState } from '../types'
import { ExtractActionFromActionCreator } from '../types/base'

function* onRehydrate() {
  const appToken = yield select(selectors.appTokenSelector)
  const githubScope = yield select(selectors.githubScopeSelector)
  const githubToken = yield select(selectors.githubTokenSelector)
  const githubTokenType = yield select(selectors.githubTokenTypeSelector)
  const githubTokenCreatedAt = yield select(selectors.githubTokenTypeSelector)
  if (!(appToken && githubToken)) return

  yield put(
    actions.loginRequest({
      appToken,
      githubScope,
      githubToken,
      githubTokenType,
      githubTokenCreatedAt,
    }),
  )
}

function* onLoginRequest(
  action: ExtractActionFromActionCreator<typeof actions.loginRequest>,
) {
  try {
    github.authenticate(action.payload.githubToken || '')

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
              scope: User['github']['scope']
              token: User['github']['token']
              tokenType: User['github']['tokenType']
              tokenCreatedAt: User['github']['tokenCreatedAt']
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
                scope
                token
                tokenType
                tokenCreatedAt
                user {
                  id
                  nodeId
                  login
                  name
                  avatarUrl
                }
              }
              createdAt
              updatedAt
              lastLoginAt
            }
          }
        }`,
      },
      {
        headers: {
          Authorization: `bearer ${action.payload.appToken}`,
        },
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

    github.authenticate(data.login.user.github.token)

    yield put(
      actions.loginSuccess({
        appToken: data.login.appToken,
        user: data.login.user,
      }),
    )
    return
  } catch (error) {
    const description = 'Login failed'
    bugsnag.notify(error, { description })
    console.error(description, error)

    if (
      error &&
      error.response &&
      (error.response.status >= 200 || error.response.status < 500)
    ) {
      yield put(
        actions.loginFailure(
          error.response.data &&
            error.response.data.errors &&
            error.response.data.errors[0],
        ),
      )
      return
    }
  }

  try {
    const response = yield call(github.octokit.users.getAuthenticated, {})
    const githubUser = fromGitHubUser(response.data as GitHubUser)
    if (!(githubUser && githubUser.id && githubUser.login))
      throw new Error('Invalid response')

    yield put(
      actions.loginSuccess({
        appToken: action.payload.appToken,
        user: {
          _id: '',
          github: {
            scope: action.payload.githubScope || [],
            token: action.payload.githubToken,
            tokenType: action.payload.githubTokenType || '',
            tokenCreatedAt: '',
            user: githubUser,
          },
          lastLoginAt: new Date().toISOString(),
          createdAt: '',
          updatedAt: '',
        },
      }),
    )
  } catch (error) {
    if (!error.name) error.name = 'AuthError'
    console.error('Alternative login failed', error)
    yield put(actions.loginFailure(error))
  }
}

function onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const { user } = action.payload

  github.authenticate(user.github.token)
  analytics.setUser(user._id)
  bugsnag.setUser(user._id, user.github.user.name || user.github.user.login)
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
}

export function* authSagas() {
  yield all([
    yield takeLatest(REHYDRATE, onRehydrate),
    yield takeLatest('LOGIN_FAILURE', onLoginFailure),
    yield takeLatest('LOGIN_REQUEST', onLoginRequest),
    yield takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    yield takeLatest('LOGOUT', onLogout),
  ])
}
