import { GitHubUser, User } from '../types'

export function fromGitHubUser(
  user: GitHubUser | undefined,
): User['github']['user'] | null {
  if (!(user && user.id)) return null

  return {
    id: `${user.id || ''}`,
    nodeId: user.node_id || '',
    login: user.login || '',
    name: user.name || '',
    avatarUrl: user.avatar_url || '',
    gravatarId: user.gravatar_id || '',
    type: user.type || 'User',
    isSiteAdmin: user.site_admin === true,
    company: user.company,
    blog: user.blog,
    location: user.location,
    email: user.email,
    isHireable: user.hireable,
    bio: user.bio,
    publicGistsCount: user.public_gists,
    publicReposCount: user.public_repos,
    privateReposCount: user.total_private_repos,
    privateGistsCount: user.private_gists,
    followersCount: user.followers,
    followingCount: user.following,
    ownedPrivateReposCount: user.owned_private_repos,
    diskUsage: user.disk_usage,
    collaboratorsCount: user.collaborators,
    isTwoFactorAuthenticationEnabled: user.two_factor_authentication,
    plan: user.plan && {
      name: user.plan.name,
      space: user.plan.space,
      collaboratorsCount: user.plan.collaborators,
      privateReposLimit: user.plan.private_repos,
    },
    createdAt: user.created_at || '',
    updatedAt: user.updated_at || '',
  }
}
