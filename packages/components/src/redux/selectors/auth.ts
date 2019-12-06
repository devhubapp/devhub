import {
  activePlans,
  getDefaultUserPlan,
  GraphQLUserPlan,
  isPlanExpired,
} from '@devhub/core'
import { createSelector } from 'reselect'

import { Platform } from '../../libs/platform'
import { EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { githubAppTokenSelector, githubTokenSelector } from './github/auth'

const s = (state: RootState) => state.auth || EMPTY_OBJ

export const authErrorSelector = (state: RootState) => s(state).error

export const isDeletingAccountSelector = (state: RootState) =>
  s(state).isDeletingAccount

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const isLoggedSelector = (state: RootState) =>
  appTokenSelector(state) &&
  (githubAppTokenSelector(state) || githubTokenSelector(state))
    ? !!(s(state).user && s(state).user!._id)
    : false

export const appTokenSelector = (state: RootState) =>
  s(state).appToken || undefined

export const currentUserSelector = (state: RootState) => {
  const user = s(state).user
  if (!isLoggedSelector(state)) return undefined
  return user
}

export const currentUserPlanSelector = createSelector(
  (state: RootState) => {
    const user = currentUserSelector(state)
    return (user && user.plan) || undefined
  },
  (state: RootState) => {
    const user = currentUserSelector(state)
    return (user && user.createdAt) || undefined
  },
  (state: RootState) => {
    const user = currentUserSelector(state)
    return (user && user.freeTrialStartAt) || undefined
  },
  (state: RootState) => {
    const user = currentUserSelector(state)
    return (user && user.freeTrialEndAt) || undefined
  },
  (
    plan,
    createdAt,
    freeTrialStartAt,
    freeTrialEndAt,
  ): GraphQLUserPlan | undefined => {
    if (Platform.OS !== 'web') {
      return {
        ...plan,
        ...activePlans.slice(-1)[0],
        status: 'active',
      } as GraphQLUserPlan
    }

    return (
      plan ||
      (createdAt &&
        getDefaultUserPlan(createdAt, {
          trialStartAt: freeTrialStartAt,
          trialEndAt: freeTrialEndAt,
        })) ||
      undefined
    )
  },
)

export const isPlanExpiredSelector = (state: RootState): boolean => {
  const plan = currentUserPlanSelector(state)
  return isPlanExpired(plan)
}

export const currentUserIdSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user._id) || undefined
}
