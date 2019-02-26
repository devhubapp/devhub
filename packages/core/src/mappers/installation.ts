import {
  WebhookPayloadInstallationInstallation,
  WebhookPayloadInstallationRepositoriesItem,
} from '@octokit/webhooks'

import { AppsListInstallationsForAuthenticatedUserResponseInstallationsItem } from '@octokit/rest'
import {
  genericGitHubResponseMapper,
  getOwnerAndRepo,
  normalizeUsername,
} from '../helpers'
import {
  CreatedInstallation,
  GraphQLGitHubInstallation,
  InstallationRepository,
} from '../types'

export function fromGitHubInstallation(
  installation:
    | WebhookPayloadInstallationInstallation & {
        permissions: any
      }
    | undefined,
): CreatedInstallation | null {
  if (!(installation && installation.id)) return null

  return {
    ...fromGitHubUserInstallation(installation),
    repositorySelection: installation.repository_selection || undefined,
    createdAt: installation.created_at
      ? new Date(installation.created_at).toISOString()
      : undefined,
    updatedAt: installation.updated_at
      ? new Date(installation.updated_at).toISOString()
      : undefined,
  }
}

export function fromGitHubUserInstallation(
  installation:
    | AppsListInstallationsForAuthenticatedUserResponseInstallationsItem
    | undefined,
): GraphQLGitHubInstallation | null {
  if (!(installation && installation.id)) return null

  return {
    id: installation.id,
    appId: installation.app_id,
    account: fromInstallationAccount(installation.account),
    events: installation.events,
    permissions: fromInstallationPermissions(installation.permissions),
    singleFileName: installation.single_file_name,
    targetId: installation.target_id,
    targetType: installation.target_type,
    htmlUrl: installation.html_url,
  }
}

export function fromInstallationAccount(
  account:
    | AppsListInstallationsForAuthenticatedUserResponseInstallationsItem['account']
    | undefined,
): GraphQLGitHubInstallation['account'] | null {
  if (!(account && account.id)) return null

  return {
    id: account.id,
    nodeId: account.node_id,
    gravatarId: account.gravatar_id,
    login: account.login,
    type: account.type,
    avatarUrl: account.avatar_url,
    siteAdmin: account.site_admin,
    url: account.url,
    htmlUrl: account.html_url,
  }
}

export function fromInstallationRepository(
  repo:
    | WebhookPayloadInstallationRepositoriesItem & {
        node_id?: string | undefined | null
        language?: string | undefined | null
        permissions?: any
        html_url?: string | undefined | null
      }
    | undefined,
): InstallationRepository | null {
  if (!(repo && repo.id)) return null

  const { owner, repo: name } = getOwnerAndRepo(repo.full_name)

  const result: InstallationRepository = {
    id: repo.id,
    nodeId: repo.node_id,
    ownerName: normalizeUsername(owner),
    repoName: normalizeUsername(repo.name || name),
    private: repo.private === true,
  }

  if (repo.language) result.language = repo.language
  if (repo.permissions)
    result.permissions = fromInstallationPermissions(repo.permissions)
  if (repo.html_url) result.htmlUrl = repo.html_url

  return result
}

export function fromInstallationPermissions(
  permissions: Record<string, any> | undefined,
): Record<string, any> | null {
  return genericGitHubResponseMapper(permissions) || null
}
