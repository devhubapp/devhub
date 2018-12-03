import { fromGitHubOrg } from './organization'
import { fromGitHubUser } from './user'

export function fromGitHubRepository(repo: any) {
  if (!repo) return null

  return {
    id: repo.id || '',
    name: repo.name || '',
    fullName: repo.full_name || '',
    isFork: repo.fork === true,
    isPrivate: repo.private === true,
    owner:
      repo.owner && repo.owner.type === 'Organization'
        ? fromGitHubOrg(repo.owner)
        : fromGitHubUser(repo.owner),
    // description: String
    // languages: [Language]
    // stargazers: StargazersConnection
    // tags: [String]
  }
}
