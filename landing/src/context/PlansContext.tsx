import React, { useContext, useEffect, useState } from 'react'

import {
  fetchPlansState,
  getCachedPublicPlans,
  PlansState,
} from '../helpers/plans'
import { useDynamicRef } from '../hooks/use-dynamic-ref'
import { useAuth } from './AuthContext'

export interface PlansProps {
  children: React.ReactNode
}

const initialState: PlansState = {
  freePlan: undefined,
  freeTrialDays: 0,
  freeTrialPlan: undefined,
  paidPlans: [],
  plans: [],
  userPlanInfo: undefined,
}

export const PlansContext = React.createContext(initialState)
PlansContext.displayName = 'PlansContext'

export function PlansProvider(props: PlansProps) {
  const [state, setState] = useState(getCachedPublicPlans() || initialState)

  const { authData } = useAuth()

  const stateRef = useDynamicRef(state)
  useEffect(() => {
    if (stateRef.current === getCachedPublicPlans() && !authData.appToken)
      return
    ;(async () => {
      try {
        const s = await fetchPlansState(authData.appToken)
        setState(s)
      } catch (error) {
        //
      }
    })()
  }, [
    !!authData.appToken,
    authData.github.login,
    authData.plan && authData.plan.id,
  ])

  return (
    <PlansContext.Provider value={state}>
      {props.children}
    </PlansContext.Provider>
  )
}

export const PlansConsumer = PlansContext.Consumer
;(PlansConsumer as any).displayName = 'PlansConsumer'

export function usePlans() {
  return useContext(PlansContext)
}
