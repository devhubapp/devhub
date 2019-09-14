import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  constants,
  getDefaultUserPlan,
  UserPlan,
} from '@brunolemos/devhub-core/dist'
import { getDefaultDevHubHeaders } from '../helpers'

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
    createdAt: string
  }
  plan: UserPlan | undefined
}

export interface AuthProviderState {
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
    createdAt: '',
  },
  plan: undefined,
}
export const AuthContext = React.createContext<AuthProviderState>({
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
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [authData, setAuthData] = useState(defaultAuthData)

  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useLayoutEffect(() => {
    const cache = getFromCache()
    if (cache) setAuthData(cache)

    if (cache && cache.appToken) login(cache.appToken)
  }, [])

  useEffect(() => {
    saveOnCache(authData)
  }, [JSON.stringify(authData)])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag === 'undefined')
      return

    if (authData && authData._id) {
      window.gtag('set', { user_id: authData && authData._id })
    }
  }, [authData && authData._id])

  const cancelSubscription = useCallback(
    (shouldPrompt = true) => {
      if (typeof window === 'undefined' || typeof fetch !== 'function') return
      if (!authData.appToken) return

      if (shouldPrompt) {
        const confirmed = confirm(
          'Cancel subscription? You will be downgraded to the free plan.' +
            (authData.plan && authData.plan.status === 'trialing'
              ? ''
              : ' If you are not on a free trial, your card might still be charged up to one more time, depending on when you cancel.'),
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
            cancelSubscription
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

          if (data && data.cancelSubscription) {
            mergeAuthData({
              plan: getDefaultUserPlan(new Date().toISOString()),
            })
          }
        } catch (error) {
          console.error(error)
          alert(
            `Failed to cancel subscription. Please contact support.\nError: ${
              error.message
            }`,
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
          "Delete account and cancel subscription? Your data can't be recovered, but you can create a new account anytime.",
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
            `Failed to delete account. Please contact support.\nError: ${
              error.message
            }`,
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
                    createdAt
                  }
                }
                plan {
                  id
                  source

                  amount
                  currency
                  trialPeriodDays
                  interval
                  intervalCount

                  status

                  startAt
                  cancelAt
                  cancelAtPeriodEnd

                  trialStartAt
                  trialEndAt

                  currentPeriodStartAt
                  currentPeriodEndAt

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
          const appTokenCreatedAt = new Date().toISOString()
          const user = data && data.login && data.login.user
          const github = user && user.github && user.github.user
          const plan = user && user.plan

          const v: AuthData = {
            _id,
            appToken: newAppToken,
            appTokenCreatedAt,
            github,
            plan,
          }
          setAuthData(isValid(v) ? v : defaultAuthData)
        } else if (response.status === 401) {
          setAuthData(defaultAuthData)
        }
      } catch (error) {
        console.error(error)
      }

      window.requestAnimationFrame(() => {
        setIsLoggingIn(false)
      })
    })()
  }, [])

  const logout = useCallback(() => {
    setAuthData(defaultAuthData)
    setIsLoggingIn(false)
  }, [])

  const mergeAuthData = useCallback((mergeData: Partial<AuthData>) => {
    setAuthData(v => ({ ...v, ...mergeData }))
  }, [])

  const value: AuthProviderState = useMemo(
    () => ({
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
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
