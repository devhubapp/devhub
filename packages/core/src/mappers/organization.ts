import { GitHubOrg } from '../types'

export function fromGitHubOrg(org: GitHubOrg | undefined) {
  if (!(org && org.id)) return null

  return {
    id: org.id,
    nodeId: org.node_id || '',
    login: org.login || '',
    avatarUrl: org.avatar_url || '',
    type: org.type || 'Organization',
  }
}
