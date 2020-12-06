import { constants, Plan } from '@devhub/core'
import React from 'react'

import { getDefaultDevHubHeaders } from '../helpers'

export interface PlansProps {
  children: React.ReactNode
}

export interface PlansStateData {
  dealCode: string | undefined
  freePlan: Plan | undefined
  freeTrialDays: number
  freeTrialPlan: Plan | undefined
  paidPlans: (Plan | undefined)[]
  plans: (Plan | undefined)[]
  userPlanInfo: Plan | undefined
}

export interface PlansState extends PlansStateData {
  errorMessage: string | undefined
  loadingState: 'initial' | 'cached' | 'loading' | 'loaded' | 'error'
  trySetDealCode(dealCode: string | undefined | null): Promise<void>
}

let cachedPublicPlans: PlansStateData
export function getCachedPublicPlans(): PlansStateData | undefined {
  if (cachedPublicPlans) return cachedPublicPlans

  try {
    cachedPublicPlans = require('../scripts/out/cached-public-plans.json') // eslint-disable-line
    return cachedPublicPlans
  } catch (error) {
    //
  }
}

const _fetch = typeof fetch === 'function' ? fetch : require('node-fetch') // eslint-disable-line
export async function fetchPlansState({
  appToken,
  dealCode,
}: {
  appToken?: string
  dealCode?: string | null
} = {}): Promise<PlansStateData> {
  const response = await _fetch(
    `${constants.API_BASE_URL}/plans${dealCode ? `?dealCode=${dealCode}` : ''}`,
    {
      method: 'GET',
      headers: {
        ...getDefaultDevHubHeaders({ appToken }),
        'Content-Type': 'application/json',
      },
    },
  )

  const data = (await response.json()) as PlansStateData

  if (!(data && data.plans)) {
    throw new Error((data as any).message || 'Something went wrong')
  }

  return {
    dealCode: data.dealCode,
    freePlan: data.freePlan,
    freeTrialDays: data.freeTrialDays,
    freeTrialPlan: data.freeTrialPlan,
    paidPlans: data.plans.filter((plan) => plan && plan.amount > 0),
    plans: data.plans,
    userPlanInfo: data.userPlanInfo,
  }
}
