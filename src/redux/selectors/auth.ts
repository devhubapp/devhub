import { RootState } from '../../types'

const s = (state: RootState) => state.auth || {}

export const errorSelector = (state: RootState) => s(state).error

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const tokenSelector = (state: RootState) => s(state).token

export const currentUserSelector = (state: RootState) =>
  tokenSelector(state) ? s(state).user : undefined
