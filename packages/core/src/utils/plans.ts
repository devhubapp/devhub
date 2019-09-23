import { Plan } from '../types'

export type ActivePlanID =
  | '5d88053df1881ef99be58133'
  | '5d4b8e44ab1ba20b9ef4a1ba'
  | '5d4b8e4de70bd8c61c13a6a9'

export type InactivePlanID = '5d4b8e85d123d1d770d93825'

export type PlanID = ActivePlanID | InactivePlanID

export type FeatureFlagId =
  | 'columnsLimit'
  | 'enableFilters'
  | 'enableSync'
  | 'enablePrivateRepositories'
  | 'enablePushNotifications'

export const allPlansObj: Record<PlanID, Plan> = {
  '5d88053df1881ef99be58133': {
    id: '5d88053df1881ef99be58133',

    stripeIds: [],

    cannonicalId: 'free',
    label: 'Free',
    description: 'Limited set of features, up to 6 columns',
    amount: 0,
    currency: 'usd',
    interval: undefined,
    intervalCount: 1,
    trialPeriodDays: 0,

    featureLabels: [
      { id: 'columnsLimit', label: 'Up to 6 columns', available: true },
      { id: 'enableFilters', label: 'All filters', available: true },
      { id: 'enableSync', label: 'Sync between devices', available: false },
      {
        id: 'enablePrivateRepositories',
        label: 'Private repositories',
        available: false,
      },
      {
        id: 'enablePushNotifications',
        label: 'Push Notifications',
        available: false,
      },
      { id: 'columnsLimit', label: 'More than 6 columns', available: false },
    ],

    featureFlags: {
      columnsLimit: 6,
      enableFilters: true,
      enableSync: false,
      enablePrivateRepositories: false,
      enablePushNotifications: false,
    },
  },
  '5d4b8e44ab1ba20b9ef4a1ba': {
    id: '5d4b8e44ab1ba20b9ef4a1ba',

    stripeIds: ['plan_FZq6KR3dWwsDMD', 'plan_FYy3loKWJXBMiA'],

    cannonicalId: 'starter',
    label: 'Starter',
    description: 'All paid features, up to 12 columns',
    amount: 1000,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,

    featureLabels: [
      { id: 'columnsLimit', label: 'Up to 12 columns', available: true },
      { id: 'enableFilters', label: 'All filters', available: true },
      { id: 'enableSync', label: 'Sync between devices', available: true },
      {
        id: 'enablePrivateRepositories',
        label: 'Private repositories',
        available: true,
      },
      {
        id: 'enablePushNotifications',
        label: 'Push Notifications',
        available: true,
      },
      { id: 'columnsLimit', label: 'More than 12 columns', available: false },
    ],

    featureFlags: {
      columnsLimit: 12,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },
  '5d4b8e4de70bd8c61c13a6a9': {
    id: '5d4b8e4de70bd8c61c13a6a9',

    stripeIds: ['plan_Fa91C1UYp4I4jk', 'plan_FYy4yB7RIG9Ex5'],

    cannonicalId: 'pro',
    label: 'Pro',
    description: 'All paid features, up to 25 columns',
    amount: 1500,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,
    featureLabels: [
      { id: 'columnsLimit', label: 'Up to 25 columns', available: true },
      { id: 'enableFilters', label: 'All filters', available: true },
      { id: 'enableSync', label: 'Sync between devices', available: true },
      {
        id: 'enablePrivateRepositories',
        label: 'Private repositories',
        available: true,
      },
      {
        id: 'enablePushNotifications',
        label: 'Push Notifications',
        available: true,
      },
      { id: 'columnsLimit', label: 'More than 25 columns', available: false },
    ],

    featureFlags: {
      columnsLimit: 25,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5d4b8e85d123d1d770d93825': {
    id: '5d4b8e85d123d1d770d93825',

    stripeIds: ['plan_Fa91LFrdFSM9vG', 'plan_Fa5EGSsHdZl3LG'],

    cannonicalId: 'max',
    label: 'Max',
    description: 'All paid features, up to 20 columns',
    amount: 2000,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,
    featureLabels: [
      { id: 'columnsLimit', label: 'Up to 20 columns', available: true },
      { id: 'enableFilters', label: 'All filters', available: true },
      { id: 'enableSync', label: 'Sync between devices', available: true },
      {
        id: 'enablePrivateRepositories',
        label: 'Private repositories',
        available: true,
      },
      {
        id: 'enablePushNotifications',
        label: 'Push Notifications',
        available: true,
      },
    ],

    featureFlags: {
      columnsLimit: 20,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },
}

export const defaultFreePlan = allPlansObj[
  '5d88053df1881ef99be58133'
] as Plan & { id: ActivePlanID }

export const allPlans = Object.values(allPlansObj)

export const activePlans: Array<Plan & { id: ActivePlanID }> = [
  defaultFreePlan,
  allPlansObj['5d4b8e44ab1ba20b9ef4a1ba'] as Plan & { id: ActivePlanID },
  allPlansObj['5d4b8e4de70bd8c61c13a6a9'] as Plan & { id: ActivePlanID },
]

export const cheapestPlanWithNotifications = activePlans
  .sort((a, b) => a.amount - b.amount)
  .find(p => p.featureFlags.enablePushNotifications)
