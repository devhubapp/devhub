import { DatabaseUser, DatabaseUserPlan } from './database'

// TODO: Auto generate this from the schema using apollo codegen cli

export interface GraphQLGitHubUser {
  id: string
  nodeId: string
  login: string
  name: string
  avatarUrl?: string
  isSiteAdmin?: boolean
  type?: 'User'
  gravatarId?: string
  company?: string
  blog?: string
  location?: string
  email?: string
  isHireable?: boolean
  bio?: string
  publicGistsCount?: number
  publicReposCount?: number
  privateReposCount?: number
  privateGistsCount?: number
  followersCount?: number
  followingCount?: number
  ownedPrivateReposCount?: number
  diskUsage?: number
  collaboratorsCount?: number
  isTwoFactorAuthenticationEnabled?: boolean
  plan?: GitHubPlan
  createdAt: string
  updatedAt: string
}

export interface GitHubTokenDetails {
  login: string
  scope?: string[] | undefined
  token: string
  tokenType?: 'bearer' | string
  tokenCreatedAt: string | Date // TODO: Fix this. Should be only one of the two.
}

export interface LoginActivity {
  [key: string]: any

  appVersion: string
  hostname: string
  isBeta: boolean
  isDevMode: boolean
  isElectron: boolean
  isLanding: boolean
  platformOS: string
  platformRealOS: string

  createdAt: string
}

export interface GraphQLUserPlan extends DatabaseUserPlan {
  banner?: string | boolean
  featureFlags: {
    columnsLimit: number
    enableFilters: boolean
    enableSync: boolean
    enablePrivateRepositories: boolean
    enablePushNotifications: boolean
  }
}

export interface GraphQLUser {
  _id: DatabaseUser['_id']
  columns?: DatabaseUser['columns']
  subscriptions?: DatabaseUser['subscriptions']
  github: DatabaseUser['github']
  freeTrialStartAt?: string
  freeTrialEndAt?: string
  plan: GraphQLUserPlan | undefined
  createdAt: DatabaseUser['createdAt']
  updatedAt: DatabaseUser['updatedAt']
  lastLoginAt: DatabaseUser['lastLoginAt']
}

export interface User extends GraphQLUser {}

export interface GitHubPlan {
  name?: string | null
  space?: number | null
  collaboratorsCount?: number | null
  privateReposLimit?: number | null
}

export interface InstallationPermissions {
  metadata?: string | null
  contents?: string | null
  issues?: string | null
}

export interface InstallationRepositoryPermissions {
  admin?: boolean | null
  push?: boolean | null
  pull?: boolean | null
}

export interface InstallationAccount {
  id?: number | null
  nodeId?: string | null
  gravatarId?: string | null
  login?: string | null
  type?: string | null
  avatarUrl?: string | null
  siteAdmin?: boolean | null
  url?: string | null
  htmlUrl?: string | null
}

export interface InstallationRepository {
  id?: number | null
  nodeId?: string | null
  ownerName?: string | null
  repoName?: string | null
  private?: boolean | null
  permissions?: InstallationRepositoryPermissions | null
  language?: string | null
  description?: string | null
  htmlUrl?: string | null
}

export interface InstallationTokenDetails {
  token?: string | null
  expiresAt?: string | null
  createdAt?: string | null
}

export interface GraphQLGitHubInstallation {
  id?: number | null
  account?: InstallationAccount | null
  appId?: number | null
  targetId?: number | null
  targetType?: string | null
  permissions?: InstallationPermissions | null
  events?: string[] | null
  singleFileName?: string | null
  htmlUrl?: string | null
}

export interface CreatedInstallation extends GraphQLGitHubInstallation {
  repositorySelection?: string
  createdAt?: string
  updatedAt?: string
}

export interface Installation extends GraphQLGitHubInstallation {
  // repositories?: InstallationRepository[] | null
  tokenDetails?: InstallationTokenDetails | null
}

export interface NormalizedInstallations {
  allIds: number[]
  allOwnerNames: string[]
  // allRepoFullNames: string[]
  byId: Record<number, Installation | undefined>
  byOwnerName: Record<string, number>
  // byRepoFullName: Record<string, number>
}
