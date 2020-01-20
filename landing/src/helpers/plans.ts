import { constants, Plan } from '@brunolemos/devhub-core'
import React from 'react'

import { getDefaultDevHubHeaders } from '../helpers'

export interface PlansProps {
  children: React.ReactNode
}

export interface PlansState {
  freePlan: Plan | undefined
  freeTrialDays: number
  freeTrialPlan: Plan | undefined
  paidPlans: Array<Plan | undefined>
  plans: Array<Plan | undefined>
  userPlanInfo: Plan | undefined
}

let cachedPublicPlans: PlansState
export function getCachedPublicPlans(): PlansState | undefined {
  if (cachedPublicPlans) return cachedPublicPlans

  try {
    cachedPublicPlans = require('../scripts/out/cached-public-plans.json') // tslint:disable-line no-var-requires
    return cachedPublicPlans
  } catch (error) {
    //
  }
}

const _fetch = typeof fetch === 'function' ? fetch : require('node-fetch') // tslint:disable-line no-var-requires
export async function fetchPlansState(appToken?: string): Promise<PlansState> {
  const response = await _fetch(`${constants.API_BASE_URL}/plans`, {
    method: 'GET',
    headers: {
      ...getDefaultDevHubHeaders({ appToken }),
      'Content-Type': 'application/json',
    },
  })

  const data = (await response.json()) as PlansState

  if (!(data && data.plans)) {
    throw new Error('Something went wrong')
  }

  return {
    freePlan: data.freePlan,
    freeTrialDays: data.freeTrialDays,
    freeTrialPlan: data.freeTrialPlan,
    paidPlans: data.plans.filter(plan => plan && plan.amount > 0),
    plans: data.plans,
    userPlanInfo: data.userPlanInfo,
  }
}
