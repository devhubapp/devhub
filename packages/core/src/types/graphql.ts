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
  name: string
  space?: number
  collaboratorsCount?: number
  privateReposLimit?: number
}

export interface InstallationPermissions {
  metadata: string
  contents: string
  issues: string
  single_file: string
}

export interface InstallationRepositoryPermissions {
  admin: boolean
  push: boolean
  pull: boolean
}

export interface InstallationAccount {
  id: number
  nodeId: string
  gravatarId?: string
  login: string
  type?: string
  avatarURL: string
  siteAdmin?: boolean
  url: string
  htmlURL?: string
}

export interface Installation {
  id: number
  account: InstallationAccount
  appId: number
  targetId: number
  targetType: string
  permissions: InstallationPermissions
  events: string[]
  singleFileName: string
  htmlURL: string
}

export interface InstallationRepository {
  id: number
  nodeId: string
  ownerName: string
  repoName: string
  private: boolean
  permissions: InstallationRepositoryPermissions | null
  language: string
  description?: string
  htmlURL: string
}

export interface InstallationResponse {
  ownerId?: number | null
  repoId?: number | null
  installation?: Installation | null
  installationRepositories?: InstallationRepository[] | null
  installationToken?: string | null
  installationTokenExpiresAt?: string | null
}
