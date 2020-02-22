import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  fetchPlansState,
  getCachedPublicPlans,
  PlansState,
} from '../helpers/plans'
import { useAuth } from './AuthContext'

export interface PlansProps {
  children: React.ReactNode
}

const initialState: PlansState = {
  dealCode: undefined,
  freePlan: undefined,
  freeTrialDays: 0,
  freeTrialPlan: undefined,
  paidPlans: [],
  plans: [],
  userPlanInfo: undefined,

  errorMessage: undefined,
  loadingState: 'initial',
  trySetDealCode() {
    throw new Error('[PlansContext] Not yet initialized.')
  },
}

export const PlansContext = React.createContext(initialState)
PlansContext.displayName = 'PlansContext'

export function PlansProvider(props: PlansProps) {
  const [state, setState] = useState<PlansState>({
    ...initialState,
    ...getCachedPublicPlans(),
    ...(getCachedPublicPlans() ? { loadingState: 'cached' } : {}),
  })

  const { authData } = useAuth()

  const tryRefetchPlansForDealCode = useCallback(
    async (dealCode: string | undefined | null): Promise<void> => {
      countRef.current = countRef.current + 1
      const currentRequest = countRef.current

      try {
        setState(v => ({
          ...v,
          errorMessage: undefined,
          loadingState: 'loading',
        }))
        const data = await fetchPlansState({
          appToken: authData.appToken,
          dealCode,
        })

        if (currentRequest !== countRef.current) return

        setState(v => ({
          ...v,
          ...data,
          errorMessage: undefined,
          loadingState: 'loaded',
        }))
      } catch (error) {
        setState(v => ({
          ...v,
          errorMessage:
            `${(error && error.response && error.response.message) ||
              (error && error.message) ||
              error ||
              ''}` || undefined,
          loadingState: 'error',
        }))
        // if (dealCode) tryRefetchPlansForDealCode(null)
        throw error
      }
    },
    [authData.appToken],
  )

  const countRef = useRef(0)
  useEffect(() => {
    if (
      state.loadingState === 'cached' &&
      !authData.appToken &&
      !state.dealCode
    )
      return

    tryRefetchPlansForDealCode(state.dealCode).catch(() => {
      //
    })
  }, [
    !!authData.appToken,
    authData.github.login,
    authData.plan && authData.plan.id,
    state.dealCode,
  ])

  const value = useMemo(
    () => ({
      ...state,
      trySetDealCode: tryRefetchPlansForDealCode,
    }),
    [state, tryRefetchPlansForDealCode],
  )

  return (
    <PlansContext.Provider value={value}>
      {props.children}
    </PlansContext.Provider>
  )
}

export const PlansConsumer = PlansContext.Consumer
;(PlansConsumer as any).displayName = 'PlansConsumer'

export function usePlans() {
  return useContext(PlansContext)
}
