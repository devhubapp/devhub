import { Column, ColumnSubscription } from './devhub'

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
  scope?: string[] | undefined
  token: string
  tokenType?: 'bearer' | string
  tokenCreatedAt: string
}

export interface User {
  _id: any
  columns?: {
    allIds: string[]
    byId: Record<string, Column | undefined>
    updatedAt: string
  }
  subscriptions?: {
    allIds: string[]
    byId: Record<string, ColumnSubscription | undefined>
    updatedAt: string
  }
  github: {
    app?: GitHubTokenDetails
    oauth?: GitHubTokenDetails
    user: GraphQLGitHubUser
  }
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

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
  single_file?: string | null
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
  avatarURL?: string | null
  siteAdmin?: boolean | null
  url?: string | null
  htmlURL?: string | null
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
  htmlURL?: string | null
}

export interface InstallationRepositoriesConnection {
  nodes?: InstallationRepository[] | null
  totalCount?: number | null
}

export interface InstallationTokenDetails {
  token?: string | null
  expiresAt?: string | null
}

export interface Installation {
  id?: number | null
  account?: InstallationAccount | null
  appId?: number | null
  targetId?: number | null
  targetType?: string | null
  permissions?: InstallationPermissions | null
  events?: string[] | null
  singleFileName?: string | null
  repositoriesConnection?: InstallationRepositoriesConnection | null
  tokenDetails?: InstallationTokenDetails | null
  htmlURL?: string | null
}

export interface InstallationsConnection {
  nodes?: Installation[] | null
  totalCount?: number | null
}
