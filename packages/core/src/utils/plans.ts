import { Plan } from '../types'

export type PlanID =
  | '5d4b8e3a853f050addb5fe12'
  | '5d4b8e44ab1ba20b9ef4a1ba'
  | '5d4b8e4de70bd8c61c13a6a9'
  | '5d4b8e85d123d1d770d93825'

export type ActivePlanID =
  | '5d4b8e3a853f050addb5fe12'
  | '5d4b8e44ab1ba20b9ef4a1ba'
  | '5d4b8e4de70bd8c61c13a6a9'
  | '5d4b8e85d123d1d770d93825'

export const allPlansObj: Record<PlanID, Plan> = {
  '5d4b8e3a853f050addb5fe12': {
    id: '5d4b8e3a853f050addb5fe12',

    stripeIds: [],

    cannonicalId: 'free',
    label: 'Free',
    description: 'Limited set of features, up to 5 columns',
    amount: 0,
    currency: 'usd',
    interval: undefined,
    intervalCount: 1,
    trialPeriodDays: 0,

    featureLabels: [
      { label: 'Up to 5 columns', available: true },
      { label: 'All filters', available: true },
      { label: 'Sync between devices', available: false },
      { label: 'Private repositorites', available: false },
      // { label: 'Push Notifications', available: false },
      { label: 'More than 5 columns', available: false },
    ],

    featureFlags: {
      columnsLimit: 5,
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
    description: 'All paid features, up to 10 columns',
    amount: 1000,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,

    featureLabels: [
      { label: 'Up to 10 columns', available: true },
      { label: 'All filters', available: true },
      { label: 'Sync between devices', available: true },
      { label: 'Private repositorites', available: true },
      // { label: 'Push Notifications', available: true },
      { label: 'More than 10 columns', available: false },
    ],

    featureFlags: {
      columnsLimit: 10,
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
    description: 'All paid features, up to 15 columns',
    amount: 1500,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,
    featureLabels: [
      { label: 'Up to 15 columns', available: true },
      { label: 'All filters', available: true },
      { label: 'Sync between devices', available: true },
      { label: 'Private repositorites', available: true },
      // { label: 'Push Notifications', available: true },
      { label: 'More than 15 columns', available: false },
    ],

    featureFlags: {
      columnsLimit: 15,
      enableFilters: true,
      enableSync: false,
      enablePrivateRepositories: false,
      enablePushNotifications: false,
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
      { label: 'Up to 20 columns', available: true },
      { label: 'All filters', available: true },
      { label: 'Sync between devices', available: true },
      { label: 'Private repositorites', available: true },
      // { label: 'Push Notifications', available: true },
    ],

    featureFlags: {
      columnsLimit: 20,
      enableFilters: true,
      enableSync: false,
      enablePrivateRepositories: false,
      enablePushNotifications: false,
    },
  },
}

export const defaultFreePlan = allPlansObj['5d4b8e3a853f050addb5fe12']

export const activePlans: Array<Plan & { id: ActivePlanID }> = [
  defaultFreePlan,
  allPlansObj['5d4b8e44ab1ba20b9ef4a1ba'],
  allPlansObj['5d4b8e4de70bd8c61c13a6a9'],
  allPlansObj['5d4b8e85d123d1d770d93825'],
]
