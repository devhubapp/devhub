import { constants, Plan } from '@brunolemos/devhub-core'
import React, { useContext, useEffect, useState } from 'react'

import { getDefaultDevHubHeaders } from '../helpers'
import { useIsMountedRef } from '../hooks/use-is-mounted-ref'
import { useAuth } from './AuthContext'

export interface PlansProps {
  children: React.ReactNode
}

export interface PlansState {
  freePlan: Plan | undefined
  freeTrialDays: number
  freeTrialPlan: Plan | undefined
  paidPlans: Plan[]
  plans: Plan[]
  userPlanInfo: Plan | undefined
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
  const isMountedRef = useIsMountedRef()

  const [state, setState] = useState(initialState)

  const { authData } = useAuth()

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch(`${constants.API_BASE_URL}/plans`, {
          method: 'GET',
          headers: {
            ...getDefaultDevHubHeaders({ appToken: authData.appToken }),
            'Content-Type': 'application/json',
          },
        })

        if (!isMountedRef.current) return

        const data = (await response.json()) as PlansState

        if (!(data && data.plans)) {
          throw new Error('Something went wrong')
        }

        setState({
          freePlan: data.freePlan,
          freeTrialDays: data.freeTrialDays,
          freeTrialPlan: data.freeTrialPlan,
          paidPlans: data.plans.filter(plan => plan.amount > 0),
          plans: data.plans,
          userPlanInfo: data.userPlanInfo,
        })
      } catch (error) {
        if (!isMountedRef.current) return
      }
    })()
  }, [authData.appToken, authData.plan && authData.plan.id])

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
