import { Plan } from '../types'
import * as constants from './constants'

export type ActivePlanID =
  | 'free'
  | '5db0d37ce59ab2d3c0bbd611'
  | '5dd44e11b2726bb02d540b5e'
  | '5dd4618db3ebb145268eba7c'
  | '5dfab6e1f63a5fda5bddb40f'

export type InactivePlanID =
  | '5d4b8e85d123d1d770d93825'
  | '5d4b8e44ab1ba20b9ef4a1ba'
  | '5d4b8e4de70bd8c61c13a6a9'
  | '5db0d55e138a98f7008a0e53'
  | '5dba30bd0621102b5cd0bc44'
  | '5dba30bf7deee78cb184291d'
  | '5dc89f56bae8d4ae5245423e'
  | '5de54fc1d6c4fded37775e71'
  | '5ded8bd7fcf793f771a0264c'
  | '5ded8e946bcd42efb0e6094a'
  | '5de54fc278c2188b4ec17fc7'
  | '5de552b6dde41be55811ed15'
  | '5dee983f450f010aa1c9ca10'
  | '5def259daae626775b89a2d0'
  | '5def28820f73d2a6fca95d45'
  | '5dd82d16eb2b11106f941f8d'
  | '5db0d5fb957ac4e5ed7bbb05'
  | '5de54fc29188ad514567ddb2'
  | '5de54fc30cd5acc31a86e884'
  | '5dd467e799537b2378df8eea'

export type PlanID = ActivePlanID | InactivePlanID

export type FeatureFlagId =
  | 'columnsLimit'
  | 'enableFilters'
  | 'enableSync'
  | 'enablePrivateRepositories'
  | 'enablePushNotifications'

const _freePlan: Plan & { id: 'free' } = {
  id: 'free',
  type: undefined,

  stripeIds: [],
  paddleProductId: undefined,

  banner: true,

  cannonicalId: 'free',
  label: 'Free',
  description: '\n\n',
  amount: 0,
  currency: 'usd',
  interval: undefined,
  intervalCount: 1,
  trialPeriodDays: 14,

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
    columnsLimit: 1,
    enableFilters: true,
    enableSync: true,
    enablePrivateRepositories: true,
    enablePushNotifications: true,
  },
}

export const freePlan: typeof _freePlan | undefined = _freePlan
export const freeTrialPlan: typeof _freePlan | undefined = freePlan && {
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
  free: _freePlan,

  '5d4b8e44ab1ba20b9ef4a1ba': {
    id: '5d4b8e44ab1ba20b9ef4a1ba',
    type: 'individual',

    stripeIds: ['plan_FZq6KR3dWwsDMD', 'plan_FYy3loKWJXBMiA'],
    paddleProductId: undefined,

    banner: 'Most popular',

    cannonicalId: 'starter',
    label: 'Starter',
    description: 'All paid features, up to 12 columns',
    amount: 1000,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 0,

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
    type: 'individual',

    stripeIds: ['plan_Fa91C1UYp4I4jk', 'plan_FYy4yB7RIG9Ex5'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'pro',
    label: 'Pro',
    description: `All paid features, up to ${constants.COLUMNS_LIMIT} columns`,
    amount: 1500,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 0,
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
    type: 'individual',

    stripeIds: ['plan_Fa91LFrdFSM9vG', 'plan_Fa5EGSsHdZl3LG'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'max',
    label: 'Max',
    description: 'All paid features, up to 20 columns',
    amount: 2000,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 0,
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
    type: 'individual',

    stripeIds: ['plan_G2zZe1HdGfVwDH', 'plan_G3Lfpx8jw3Smxc'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'monthly',
    label: 'Monthly',
    description: '\n\n',
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
    type: 'individual',

    stripeIds: ['plan_G2y6Y7RtMt5oAE', 'plan_G3Li3X9Qaj9vxo'],
    paddleProductId: undefined,

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
    type: 'individual',

    stripeIds: ['plan_G2y7gq9I7sd8Gc', 'plan_G3Liuh6wnA8Git'],
    paddleProductId: undefined,

    banner: '42% OFF',

    cannonicalId: 'yearly',
    label: 'Yearly',
    description: '\n\n',
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

  '5dba30bd0621102b5cd0bc44': {
    id: '5dba30bd0621102b5cd0bc44',
    type: 'individual',

    stripeIds: ['plan_G5d9TcPDExqFcc', 'plan_G5dgccnsYVmSXX'],
    paddleProductId: undefined,

    banner: '10% OFF',

    cannonicalId: '3-monthly',
    label: '3-Monthly',
    description: '',
    amount: 2697,
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

  '5dba30bf7deee78cb184291d': {
    id: '5dba30bf7deee78cb184291d',
    type: 'individual',

    stripeIds: ['plan_G5dAdlW5lu5Ld5', 'plan_G5dhda9cEU3r0H'],
    paddleProductId: undefined,

    banner: '20% OFF',

    cannonicalId: '6-monthly',
    label: '6-Monthly',
    description: '',
    amount: 4794,
    currency: 'usd',
    interval: 'month',
    intervalCount: 6,
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

  '5dc89f56bae8d4ae5245423e': {
    id: '5dc89f56bae8d4ae5245423e',
    type: 'individual',

    stripeIds: ['plan_G9jW5bWfdl4T0T', 'plan_G9jQYMzS9KkKrk'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'monthly',
    label: 'Monthly',
    description: '',
    amount: 699,
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

  '5dd44e11b2726bb02d540b5e': {
    id: '5dd44e11b2726bb02d540b5e',
    type: 'individual',

    stripeIds: ['plan_GD3I71EXD50V2t', 'plan_GD3FmlLdmL4M9E'],
    paddleProductId: undefined,

    banner: '25% OFF',

    cannonicalId: 'yearly',
    label: 'Yearly',
    description: '\n\n',
    amount: 9000,
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

  '5dd4618db3ebb145268eba7c': {
    id: '5dd4618db3ebb145268eba7c',
    type: 'team',

    stripeIds: ['plan_GDCxyxPMVxrmGM', 'plan_GD4d9NyJT9PZjT'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'team-monthly',
    label: 'Team Monthly',
    description: '\n\n',
    amount: 4900,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: {
      divideBy: 5,
      round: 'up',
    },

    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5dd467e799537b2378df8eea': {
    id: '5dd467e799537b2378df8eea',
    type: 'team',

    stripeIds: ['plan_GDCyDqLyRC5Q5o', 'plan_GDCwjCwtc7aIEm'],
    paddleProductId: undefined,

    banner: '29% OFF',

    cannonicalId: 'team-yearly',
    label: 'Team Yearly',
    description: '\n\n',
    amount: 25200,
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: {
      divideBy: 3,
      round: 'up',
    },

    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5de54fc1d6c4fded37775e71': {
    id: '5de54fc1d6c4fded37775e71',
    type: 'individual',

    stripeIds: ['plan_GHtKdXsTarbJQm', 'plan_GHsZlXP4v8Irqf'],
    paddleProductId: undefined,

    banner: '20% OFF',

    cannonicalId: 'monthly',
    label: 'Monthly',
    description: '\n\n',
    amount: 800,
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

  '5de54fc29188ad514567ddb2': {
    id: '5de54fc29188ad514567ddb2',
    type: 'individual',

    stripeIds: ['plan_GHtLwVwqE6dhbO', 'plan_GHsnbxegDBcrQ0'],
    paddleProductId: undefined,

    banner: '50% OFF',

    cannonicalId: 'yearly',
    label: 'Yearly',
    description: '\n\n',
    amount: 6000,
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

  '5de54fc278c2188b4ec17fc7': {
    id: '5de54fc278c2188b4ec17fc7',
    type: 'team',

    stripeIds: ['plan_GHtLrxHfn3DDkr', 'plan_GHsabiw9GfQH9N'],
    paddleProductId: undefined,

    banner: '30% OFF',

    cannonicalId: 'team-monthly',
    label: 'Team Monthly',
    description: '\n\n',
    amount: 2500,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: {
      divideBy: 3,
      round: 'up',
    },

    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5de54fc30cd5acc31a86e884': {
    id: '5de54fc30cd5acc31a86e884',
    type: 'team',

    stripeIds: ['plan_GKEKN4EG1Rawje', 'plan_GHsqgnLvYnfu2q'],
    paddleProductId: undefined,

    banner: '48% OFF',

    cannonicalId: 'team-yearly',
    label: 'Team Yearly',
    description: '\n\n',
    amount: 15000,
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: {
      divideBy: 2,
      round: 'up',
    },

    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5dd82d16eb2b11106f941f8d': {
    id: '5dd82d16eb2b11106f941f8d',
    type: undefined,

    stripeIds: [],
    paddleProductId: 566713,

    banner: true,

    cannonicalId: 'lifetime-v1',
    label: 'Lifetime v1',
    description: `Lifetime access from v0.9 to v1.9 \n(current: v${constants.APP_VERSION})`,
    amount: 9900,
    currency: 'usd',
    interval: undefined,
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: undefined,

    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5de552b6dde41be55811ed15': {
    id: '5de552b6dde41be55811ed15',
    type: 'team',

    stripeIds: [],
    paddleProductId: 577489,

    banner: '33% OFF',

    cannonicalId: 'team-lifetime-v1',
    label: 'Team Lifetime v1',
    description: `Lifetime access from v0.9 to v1.9 \n(current: v${constants.APP_VERSION})`,
    amount: 9900,
    currency: 'usd',
    interval: undefined,
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: undefined,

    featureLabels: [],

    featureFlags: {
      columnsLimit: constants.COLUMNS_LIMIT,
      enableFilters: true,
      enableSync: true,
      enablePrivateRepositories: true,
      enablePushNotifications: true,
    },
  },

  '5ded8bd7fcf793f771a0264c': {
    id: '5ded8bd7fcf793f771a0264c',
    type: 'individual',

    stripeIds: ['plan_GKEKNpDiuSZv46', 'plan_GKDvgmdNgDOOso'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'monthly',
    label: 'Monthly',
    description: '\n\n',
    amount: 1200,
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

  '5ded8e946bcd42efb0e6094a': {
    id: '5ded8e946bcd42efb0e6094a',
    type: 'individual',

    stripeIds: ['plan_GKELMpfqKbmnQe', 'plan_GKE7HnxNA4f9tN'],
    paddleProductId: undefined,

    banner: '30% OFF',

    cannonicalId: 'yearly',
    label: 'Yearly',
    description: '\n\n',
    amount: 9900,
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

  '5dee983f450f010aa1c9ca10': {
    id: '5dee983f450f010aa1c9ca10',
    type: undefined,

    stripeIds: [],
    paddleProductId: 578122,

    banner: false,

    cannonicalId: 'paddle-6mo',
    label: '',
    description: '',
    amount: 4900,
    currency: 'usd',
    interval: 'month',
    intervalCount: 6,
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

  '5def259daae626775b89a2d0': {
    id: '5def259daae626775b89a2d0',
    type: 'individual',

    stripeIds: ['plan_GKgA6MdMkebG4g', 'plan_GKg8ENlpVmLVCr'],
    paddleProductId: undefined,

    banner: false,

    cannonicalId: 'stripe-6mo',
    label: '',
    description: '',
    amount: 4900,
    currency: 'usd',
    interval: 'month',
    intervalCount: 6,
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

  '5def28820f73d2a6fca95d45': {
    id: '5def28820f73d2a6fca95d45',
    type: 'individual',

    stripeIds: ['plan_GKgKdyVaWtpiY1', 'plan_GKgMTwxlYpV0rr'],
    paddleProductId: undefined,

    banner: true,

    cannonicalId: 'stripe-3mo',
    label: 'Pay as you go',
    description: '\n\n',
    amount: 2900,
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

  '5dfab6e1f63a5fda5bddb40f': {
    id: '5dfab6e1f63a5fda5bddb40f',
    type: 'team',

    stripeIds: ['plan_GNxyeVqQGVbaKY', 'plan_GNxvchw3CxXnUh'],
    paddleProductId: undefined,

    banner: '30% OFF',

    cannonicalId: 'team-yearly',
    label: 'Team Yearly',
    description: '\n\n',
    amount: 24900,
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
    trialPeriodDays: 0,
    transformUsage: {
      divideBy: 3,
      round: 'up',
    },

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

export const activePlans: Plan[] = [
  freeTrialPlan,
  allPlansObj['5db0d37ce59ab2d3c0bbd611'],
  allPlansObj['5dd44e11b2726bb02d540b5e'],
  allPlansObj['5dd4618db3ebb145268eba7c'],
  allPlansObj['5dfab6e1f63a5fda5bddb40f'],
]

export const activePaidPlans = activePlans.filter(plan => plan.amount > 0)

export const cheapestPlanWithNotifications = activePlans
  .slice()
  .filter(
    plan =>
      !!(plan && plan.amount > 0 && plan.featureFlags.enablePushNotifications),
  )
  .sort((a, b) => a.amount - b.amount)[0]

export const freeTrialDays =
  // (freeTrialPlan && (freeTrialPlan as any).trialPeriodDays) ||
  (activePaidPlans &&
    activePaidPlans[0] &&
    activePaidPlans[0].trialPeriodDays) ||
  0

/*
(function generateNewObjectId() {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16)

  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
      .toLowerCase()
  )
})()
*/
