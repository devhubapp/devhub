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
    scope: string[]
    token: string
    tokenType: string
    tokenCreatedAt: string
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
