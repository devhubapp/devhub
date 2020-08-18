import { constants, Plan } from '@devhub/core'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

import { useIsMountedRef } from '../../hooks/use-is-mounted-ref'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { getDefaultDevHubHeaders } from '../../utils/api'

export interface PlansProps {
  children: React.ReactNode
}

export interface PlansState {
  cheapestPlanWithNotifications: Plan | undefined
  freePlan: Plan | undefined
  freeTrialDays: number
  freeTrialPlan: Plan | undefined
  paidPlans: (Plan | undefined)[]
  plans: (Plan | undefined)[]
  userPlanInfo: Plan | undefined
}

const initialState: PlansState = {
  cheapestPlanWithNotifications: undefined,
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

  const appToken = useReduxState(selectors.appTokenSelector)
  const userPlan = useReduxState(selectors.currentUserPlanSelector)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get(`${constants.API_BASE_URL}/plans`, {
          headers: getDefaultDevHubHeaders({ appToken }),
        })

        if (!isMountedRef.current) return

        const data = response.data as PlansState

        if (!(data && data.plans)) {
          throw new Error('Something went wrong')
        }

        setState({
          cheapestPlanWithNotifications: data.plans
            .slice()
            .filter(
              (plan) =>
                !!(
                  plan &&
                  plan.amount > 0 &&
                  plan.featureFlags.enablePushNotifications
                ),
            )
            .sort((a, b) => (a && b ? a.amount - b.amount : 0))[0],
          freePlan: data.freePlan,
          freeTrialDays: data.freeTrialDays,
          freeTrialPlan: data.freeTrialPlan,
          paidPlans: data.plans.filter((plan) => !!(plan && plan.amount > 0)),
          plans: data.plans,
          userPlanInfo: data.userPlanInfo,
        })
      } catch (error) {
        if (!isMountedRef.current) return
      }
    })()
  }, [appToken, userPlan && userPlan.id])

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
