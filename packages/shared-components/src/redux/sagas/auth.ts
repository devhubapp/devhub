import axios, { AxiosResponse } from 'axios'
import { REHYDRATE } from 'redux-persist'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import {
  ExtractActionFromActionCreator,
  GitHubUser,
} from 'shared-core/dist/types'
import { User } from 'shared-core/dist/types/graphql'
import { GRAPHQL_ENDPOINT } from 'shared-core/dist/utils/constants'
import { fromGitHubUser } from '../../api/mappers/user'
import * as github from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'

function* onRehydrate() {
  const appToken = yield select(selectors.appTokenSelector)
  const githubToken = yield select(selectors.githubTokenSelector)
  if (!(appToken && githubToken)) return

  yield put(actions.loginRequest({ appToken, githubToken }))
}

function* onLoginRequest(
  action: ExtractActionFromActionCreator<typeof actions.loginRequest>,
) {
  try {
    github.authenticate(action.payload.githubToken || '')

    const response: AxiosResponse<{
      data: {
        login: {
          appToken: string
          githubToken: string
          user: User | null
        } | null
      }
      errors?: any[]
    }> = yield axios.post(
      GRAPHQL_ENDPOINT,
      {
        query: `query auth {
          login {
            appToken
            githubToken
            user {
              _id
              github {
                id
                nodeId
                login
                name
                avatarUrl
                type
                bio
                publicGistsCount
                publicReposCount
                privateReposCount
                privateGistsCount
                followersCount
                followingCount
                ownedPrivateReposCount
                isTwoFactorAuthenticationEnabled
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
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
      throw { response }
    }

    if (
      !(
        data &&
        data.login &&
        data.login.appToken &&
        data.login.githubToken &&
        data.login.user &&
        data.login.user._id &&
        data.login.user.github &&
        data.login.user.github.id
      )
    ) {
      throw new Error('Invalid response')
    }

    github.authenticate(data.login.githubToken)

    yield put(
      actions.loginSuccess({
        appToken: data.login.appToken,
        githubToken: data.login.githubToken,
        user: data.login.user,
      }),
    )
    return
  } catch (error) {
    console.error(error.response)

    if (
      error &&
      error.response &&
      (error.response.status >= 200 || error.response.status < 500)
    ) {
      yield put(actions.loginFailure(error.response.data))
      return
    }
  }

  try {
    const response = yield call(github.octokit.users.getAuthenticated, {})
    const githubUser = response.data as GitHubUser
    const user = fromGitHubUser(githubUser)
    if (!(user && user.id && user.login)) throw new Error('Invalid response')

    yield put(
      actions.loginSuccess({
        appToken: action.payload.appToken,
        githubToken: action.payload.githubToken,
        user: { _id: '', github: user, createdAt: '', updatedAt: '' },
      }),
    )
  } catch (error) {
    yield put(actions.loginFailure(error))
  }
}

function onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  github.authenticate(action.payload.githubToken)
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
