import { Plan } from '../types'
import * as constants from './constants'

export type ActivePlanID =
  | 'free'
  | '5db0d37ce59ab2d3c0bbd611'
  | '5db0d55e138a98f7008a0e53'
  | '5db0d5fb957ac4e5ed7bbb05'

export type InactivePlanID =
  | '5d4b8e85d123d1d770d93825'
  | '5d4b8e44ab1ba20b9ef4a1ba'
  | '5d4b8e4de70bd8c61c13a6a9'

export type PlanID = ActivePlanID | InactivePlanID

export type FeatureFlagId =
  | 'columnsLimit'
  | 'enableFilters'
  | 'enableSync'
  | 'enablePrivateRepositories'
  | 'enablePushNotifications'

export const freePlan: Plan & { id: 'free' } = {
  id: 'free',

  stripeIds: [],

  banner: true,

  cannonicalId: 'free',
  label: 'Free',
  description: '',
  amount: 0,
  currency: 'usd',
  interval: undefined,
  intervalCount: 1,
  trialPeriodDays: 7,

  featureLabels: [
    // { id: 'columnsLimit', label: 'Up to 6 columns', available: true },
    // { id: 'enableFilters', label: 'All filters', available: true },
    // { id: 'enableSync', label: 'Sync between devices', available: false },
    // {
    //   id: 'enablePrivateRepositories',
    //   label: 'Private repositories',
    //   available: false,
    // },
    // {
    //   id: 'enablePushNotifications',
    //   label: 'Push Notifications',
    //   available: false,
    // },
    // { id: 'columnsLimit', label: 'More than 6 columns', available: false },
  ],

  featureFlags: {
    columnsLimit: 0,
    enableFilters: false,
    enableSync: false,
    enablePrivateRepositories: false,
    enablePushNotifications: false,
  },
}

export const freeTrialPlan = {
  ...freePlan,
  label: 'Free trial',
  featureFlags: {
    columnsLimit: 10,
    enableFilters: true,
    enablePrivateRepositories: true,
    enablePushNotifications: true,
    enableSync: true,
  },
}

export const allPlansObj: Record<PlanID, Plan> = {
  free: freeTrialPlan,
  '5d4b8e44ab1ba20b9ef4a1ba': {
    id: '5d4b8e44ab1ba20b9ef4a1ba',

    stripeIds: ['plan_FZq6KR3dWwsDMD', 'plan_FYy3loKWJXBMiA'],

    banner: 'Most popular',

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

    banner: true,

    cannonicalId: 'pro',
    label: 'Pro',
    description: `All paid features, up to ${constants.COLUMNS_LIMIT} columns`,
    amount: 1500,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,
    featureLabels: [
      {
        id: 'columnsLimit',
        label: `Up to ${constants.COLUMNS_LIMIT} columns`,
        available: true,
      },
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
      {
        id: 'columnsLimit',
        label: `More than ${constants.COLUMNS_LIMIT} columns`,
        available: false,
      },
    ],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5d4b8e85d123d1d770d93825': {
    id: '5d4b8e85d123d1d770d93825',

    stripeIds: ['plan_Fa91LFrdFSM9vG', 'plan_Fa5EGSsHdZl3LG'],

    banner: true,

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

  '5db0d37ce59ab2d3c0bbd611': {
    id: '5db0d37ce59ab2d3c0bbd611',

    stripeIds: ['plan_G2zZe1HdGfVwDH', 'plan_G3Lfpx8jw3Smxc'],

    banner: true,

    cannonicalId: 'monthly',
    label: 'Monthly',
    description: '',
    amount: 999,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 0,
    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5db0d55e138a98f7008a0e53': {
    id: '5db0d55e138a98f7008a0e53',

    stripeIds: ['plan_G2y6Y7RtMt5oAE', 'plan_G3Li3X9Qaj9vxo'],

    banner: '20% OFF',

    cannonicalId: '3-monthly',
    label: '3-Monthly',
    description: '',
    amount: 2400,
    currency: 'usd',
    interval: 'month',
    intervalCount: 3,
    trialPeriodDays: 0,
    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5db0d5fb957ac4e5ed7bbb05': {
    id: '5db0d5fb957ac4e5ed7bbb05',

    stripeIds: ['plan_G2y7gq9I7sd8Gc', 'plan_G3Liuh6wnA8Git'],

    banner: '42% OFF',

    cannonicalId: 'yearly',
    label: 'Yearly',
    description: '',
    amount: 6900,
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
    trialPeriodDays: 0,
    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },
}

export const allPlans = Object.values(allPlansObj)

export const activePlans: Array<Plan & { id: ActivePlanID }> = [
  allPlansObj.free as Plan & { id: ActivePlanID },
  allPlansObj['5db0d37ce59ab2d3c0bbd611'] as Plan & { id: ActivePlanID },
  allPlansObj['5db0d55e138a98f7008a0e53'] as Plan & { id: ActivePlanID },
  allPlansObj['5db0d5fb957ac4e5ed7bbb05'] as Plan & { id: ActivePlanID },
]

export const activePaidPlans = activePlans.filter(plan => plan.amount > 0)

export const cheapestPlanWithNotifications = activePlans
  .slice()
  .sort((a, b) => a.amount - b.amount)
  .find(p => p.featureFlags.enablePushNotifications)

/*
function generateNewObjectId() {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16)

  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
      .toLowerCase()
  )
}
generateNewObjectId()
*/
