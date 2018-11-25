// TODO: Auto generate this from the schema using apollo codegen cli

export interface User {
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
  plan: GitHubPlan
  createdAt: string
  updatedAt: string
}

export interface GitHubPlan {
  name: string
  space?: number
  collaboratorsCount?: number
  privateReposLimit?: number
}
