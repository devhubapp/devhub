import axios, { AxiosResponse } from 'axios'
import { REHYDRATE } from 'redux-persist'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import {
  ExtractActionFromActionCreator,
  GitHubUser,
} from 'shared-core/dist/types'
import { GRAPHQL_ENDPOINT } from 'shared-core/dist/utils/constants'
import { fromGitHubUser } from '../../api/mappers/user'
import * as github from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'

function* onRehydrate() {
  const token = yield select(selectors.tokenSelector)
  if (token) yield put(actions.loginRequest({ token }))
}

function* onLoginRequest(
  action: ExtractActionFromActionCreator<typeof actions.loginRequest>,
) {
  github.authenticate(action.payload.token || '')

  try {
    const response: AxiosResponse<{
      data: { me: any }
      errors?: any[]
    }> = yield axios.post(
      GRAPHQL_ENDPOINT,
      {
        query: `query me {
          me {
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
        }`,
      },
      {
        headers: {
          Authorization: `bearer ${action.payload.token}`,
        },
      },
    )

    const { data, errors } = response.data

    if (errors && errors.length) {
      throw { response }
    }

    if (!(data && data.me && data.me.id)) throw new Error('Invalid response')

    yield put(actions.loginSuccess({ user: data.me }))
    return
  } catch (error) {
    console.error(error.response)

    if (
      error &&
      error.response &&
      (error.response.status === 401 ||
        (error.response.data &&
          Array.isArray(error.response.data.errors) &&
          error.response.data.errors.some(
            (e: any) => e.extensions && e.extensions.code === 'UNAUTHENTICATED',
          )))
    ) {
      yield put(actions.loginFailure(error.response.data))
      return
    }
  }

  try {
    const response = yield call(github.octokit.users.get, {})
    const githubUser = response.data as GitHubUser
    const user = fromGitHubUser(githubUser)
    if (!(user && user.id && user.login)) throw new Error('Invalid response')

    yield put(actions.loginSuccess({ user }))
  } catch (error) {
    yield put(actions.loginFailure(error))
  }
}

function* onLoginFailure(
  action: ExtractActionFromActionCreator<typeof actions.loginFailure>,
) {
  if (action.error.code === 401) yield put(actions.logout())
}

function onLogout() {
  github.authenticate('')
}

export function* authSagas() {
  yield all([
    yield takeLatest(REHYDRATE, onRehydrate),
    yield takeLatest('LOGIN_FAILURE', onLoginFailure),
    yield takeLatest('LOGIN_REQUEST', onLoginRequest),
    yield takeLatest('LOGOUT', onLogout),
  ])
}
