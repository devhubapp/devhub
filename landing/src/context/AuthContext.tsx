import { constants, UserPlan } from '@brunolemos/devhub-core'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { getDefaultDevHubHeaders } from '../helpers'
import { useIsMountedRef } from '../hooks/use-is-mounted-ref'

export interface AuthProviderProps {
  children: React.ReactNode
}

export interface AuthData {
  _id: string
  appToken: string
  appTokenCreatedAt: string
  github: {
    id: string
    nodeId: string
    login: string
    name: string
    email?: string
    createdAt: string
  }
  freeTrialStartAt: string | undefined
  freeTrialEndAt: string | undefined
  paddle?: {
    email?: string
    coupon?: string
  }
  plan: UserPlan | undefined
  createdAt: string
}

export interface AuthProviderState {
  abortSubscriptionCancellation: () => void
  authData: AuthData
  cancelSubscription: (shouldPrompt?: boolean) => void
  deleteAccount: (shouldPrompt?: boolean) => void
  isLoggingIn: boolean
  login: (appToken: string) => void
  logout: () => void
  mergeAuthData: (mergeData: Partial<AuthData>) => void
}

const defaultAuthData: AuthData = {
  _id: '',
  appToken: '',
  appTokenCreatedAt: '',
  github: {
    id: '',
    nodeId: '',
    login: '',
    name: '',
    email: undefined,
    createdAt: '',
  },
  freeTrialStartAt: '',
  freeTrialEndAt: '',
  paddle: undefined,
  plan: undefined,
  createdAt: '',
}
export const AuthContext = React.createContext<AuthProviderState>({
  abortSubscriptionCancellation(_shouldPrompt = true) {
    throw new Error('AuthContext not yet initialized.')
  },
  authData: defaultAuthData,
  cancelSubscription(_shouldPrompt = true) {
    throw new Error('AuthContext not yet initialized.')
  },
  deleteAccount(_shouldPrompt = true) {
    throw new Error('AuthContext not yet initialized.')
  },
  isLoggingIn: false,
  login(_appToken: string) {
    throw new Error('AuthContext not yet initialized.')
  },
  logout() {
    throw new Error('AuthContext not yet initialized.')
  },
  mergeAuthData() {
    throw new Error('AuthContext not yet initialized.')
  },
})
AuthContext.displayName = 'AuthContext'

export function AuthProvider(props: AuthProviderProps) {
  const Router = useRouter()

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [authData, setAuthData] = useState(defaultAuthData)

  const isMountedRef = useIsMountedRef()

  useLayoutEffect(() => {
    const cache = getFromCache()
    if (cache) setAuthData(cache)

    if (cache && cache.appToken) login(cache.appToken)
  }, [])

  useEffect(() => {
    saveOnCache(authData)
  }, [JSON.stringify(authData)])

  useEffect(() => {
    if (typeof gtag === 'undefined') return

    if (authData && authData._id) {
      gtag('config', 'UA-52350759-6', {
        user_id: (authData && authData._id) || undefined,
      })
    }
  }, [authData && authData._id])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const appToken = Router.query.appToken as string | undefined
    if (!appToken) return

    const querystring = qs.stringify(
      { ...Router.query, appToken: undefined },
      { addQueryPrefix: true },
    )
    Router.replace(`${Router.pathname}${querystring}`, undefined, {
      shallow: true,
    })

    login(appToken)
  }, [Router.query.appToken])

  const abortSubscriptionCancellation = useCallback(() => {
    if (typeof window === 'undefined' || typeof fetch !== 'function') return
    if (!authData.appToken) return
    ;(async () => {
      try {
        const response = await fetch(constants.GRAPHQL_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({
            query: `
              mutation {
                abortSubscriptionCancellation
              }`,
          }),
          headers: {
            ...getDefaultDevHubHeaders({ appToken: authData.appToken }),
            'Content-Type': 'application/json',
          },
        })

        if (!isMountedRef.current) return

        const { data, errors } = await response.json()

        if (errors && errors[0] && errors[0].message)
          throw new Error(errors[0].message)

        if (data && data.abortSubscriptionCancellation) {
          mergeAuthData({
            // plan: getDefaultUserPlan(authData.createdAt, {
            //   trialStartAt: authData.freeTrialStartAt,
            //   trialEndAt: authData.freeTrialEndAt,
            // }),
            plan: {
              ...authData.plan!,
              cancelAt: undefined,
              cancelAtPeriodEnd: false,
            },
          })
        }
      } catch (error) {
        console.error(error)
        alert(
          `Failed to abort subscription cancellation. Please contact support.\nError: ${error.message}`,
        )
      }
    })()
  }, [authData.appToken, authData.plan])

  const cancelSubscription = useCallback(
    (shouldPrompt = true) => {
      if (typeof window === 'undefined' || typeof fetch !== 'function') return
      if (!authData.appToken) return

      let reason: string | null = null
      if (shouldPrompt) {
        reason = prompt(
          'Cancel subscription? Your subscription will be cancelled at the end of the billing period.' +
            ' You can keep using DevHub for the already paid period.' +
            // (authData.plan && authData.plan.status === 'trialing'
            //   ? ''
            //   : ' If you are not on a free trial, your card might still be charged up to one more time, depending on when you cancel.') +
            '\n\nI am cancelling because...',
        )
        if (!reason) return
      }

      ;(async () => {
        try {
          const response = await fetch(constants.GRAPHQL_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
              query: `
                mutation($input: CancelSubscriptionInput) {
                  cancelSubscription(input: $input)
              }`,
              variables: {
                input: {
                  reason: reason || '',
                },
              },
            }),
            headers: {
              ...getDefaultDevHubHeaders({ appToken: authData.appToken }),
              'Content-Type': 'application/json',
            },
          })

          if (!isMountedRef.current) return

          const { data, errors } = await response.json()

          if (errors && errors[0] && errors[0].message)
            throw new Error(errors[0].message)

          if (data && data.cancelSubscription) {
            mergeAuthData({
              // plan: getDefaultUserPlan(authData.createdAt, {
              //   trialStartAt: authData.freeTrialStartAt,
              //   trialEndAt: authData.freeTrialEndAt,
              // }),
              plan: {
                ...authData.plan!,
                cancelAt: authData.plan && authData.plan.currentPeriodEndAt,
                cancelAtPeriodEnd: true,
              },
            })
          }
        } catch (error) {
          console.error(error)
          alert(
            `Failed to cancel subscription. Please contact support.\nError: ${error.message}`,
          )
        }
      })()
    },
    [
      authData.appToken,
      !!(authData.plan && authData.plan.status === 'trialing'),
    ],
  )

  const deleteAccount = useCallback(
    (shouldPrompt = true) => {
      if (typeof window === 'undefined' || typeof fetch !== 'function') return
      if (!authData.appToken) return

      if (shouldPrompt) {
        const confirmed = confirm(
          "Delete account and cancel subscription? Your data can't be recovered," +
            ' but you can create a new account anytime.',
        )
        if (!confirmed) return
      }

      ;(async () => {
        try {
          const response = await fetch(constants.GRAPHQL_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
              query: `
          mutation {
            deleteAccount
          }`,
            }),
            headers: {
              ...getDefaultDevHubHeaders({ appToken: authData.appToken }),
              'Content-Type': 'application/json',
            },
          })

          if (!isMountedRef.current) return

          const { data, errors } = await response.json()

          if (errors && errors[0] && errors[0].message)
            throw new Error(errors[0].message)

          if (data && data.deleteAccount) logout()
        } catch (error) {
          console.error(error)
          alert(
            `Failed to delete account. Please contact support.\nError: ${error.message}`,
          )
        }
      })()
    },
    [authData.appToken],
  )

  const login = useCallback((appToken: string) => {
    if (typeof window === 'undefined' || typeof fetch !== 'function') return
    if (!appToken) return
    ;(async () => {
      try {
        setIsLoggingIn(true)
        const response = await fetch(constants.GRAPHQL_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({
            query: `
          {
            login {
              appToken
              user {
                _id
                github {
                  user {
                    id
                    nodeId
                    login
                    name
                    email
                    createdAt
                  }
                }
                paddle {
                  email
                  coupon
                }
                freeTrialStartAt
                freeTrialEndAt
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
              }
            }
          }`,
          }),
          headers: {
            ...getDefaultDevHubHeaders({ appToken }),
            'Content-Type': 'application/json',
          },
        })

        if (!isMountedRef.current) return

        if (response.status >= 200 && response.status < 300) {
          const { data } = await response.json()

          const _id =
            data && data.login && data.login.user && data.login.user._id
          const newAppToken = data && data.login && data.login.appToken
          const user = data && data.login && data.login.user

          const v: AuthData = {
            _id,
            appToken: newAppToken,
            appTokenCreatedAt: new Date().toISOString(),
            github: user && user.github && user.github.user,
            paddle: undefined,
            plan: user && user.plan,
            createdAt: user && user.createdAt,
            freeTrialStartAt: user && user.freeTrialStartAt,
            freeTrialEndAt: user && user.freeTrialEndAt,
          }
          setAuthData(isValid(v) ? v : defaultAuthData)
        } else {
          throw new Error('Login failed')
        }
      } catch (error) {
        console.error(error)
        setAuthData(defaultAuthData)
      }

      window.requestAnimationFrame(() => {
        setIsLoggingIn(false)
      })
    })()
  }, [])

  const logout = useCallback(() => {
    Router.push('/')
    setAuthData(defaultAuthData)
    setIsLoggingIn(false)
  }, [])

  const mergeAuthData = useCallback((mergeData: Partial<AuthData>) => {
    setAuthData(v => ({ ...v, ...mergeData }))
  }, [])

  const value: AuthProviderState = useMemo(
    () => ({
      abortSubscriptionCancellation,
      authData,
      cancelSubscription,
      deleteAccount,
      isLoggingIn,
      login,
      logout,
      mergeAuthData,
    }),
    [
      JSON.stringify(authData),
      deleteAccount,
      isLoggingIn,
      login,
      logout,
      mergeAuthData,
    ],
  )

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
;(AuthConsumer as any).displayName = 'AuthConsumer'

export function useAuth() {
  return useContext(AuthContext)
}

function isValid(auth: AuthData | undefined) {
  return !!(
    auth &&
    auth._id &&
    auth.appToken &&
    auth.github &&
    auth.github.login
  )
}

function getFromCache(): AuthData | undefined {
  if (typeof localStorage === 'undefined') return

  try {
    const _cache = localStorage.getItem('auth')
    if (!_cache) return

    const cache = JSON.parse(_cache) as AuthData
    if (!isValid(cache)) return

    return cache
  } catch (error) {
    console.error(error)
  }
}

function saveOnCache(auth: AuthData | undefined) {
  if (typeof localStorage === 'undefined') return

  try {
    if (!isValid(auth)) {
      localStorage.setItem('auth', '{}')
      return false
    }

    localStorage.setItem('auth', JSON.stringify(auth))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

declare global {
  const gtag: ((...args: any[]) => void) | undefined
}
