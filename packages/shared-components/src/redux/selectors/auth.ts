import { RootState } from '../types'

const s = (state: RootState) => state.auth || {}

export const errorSelector = (state: RootState) => s(state).error

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const appTokenSelector = (state: RootState) => s(state).appToken

export const githubTokenSelector = (state: RootState) => s(state).githubToken

export const currentUserSelector = (state: RootState) =>
  appTokenSelector(state) && githubTokenSelector(state)
    ? s(state).user
    : undefined
