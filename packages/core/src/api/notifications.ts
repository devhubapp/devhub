import axios, { AxiosResponse } from 'axios'
import _ from 'lodash'
import qs from 'qs'

import {
  defaultGitHubBaseAPIURL,
  fixURLForPlatform,
  getCommentIdFromUrl,
  getDefaultPaginationPerPage,
  getIssueOrPullRequestNumberFromUrl,
  getRepoFullNameFromUrl,
  GitHubURLOptions,
} from '../helpers'
import { EnhancedGitHubNotification } from '../types/devhub'
import {
  GitHubNotification,
  GitHubNotificationReason,
  GitHubNotificationSubjectType,
} from '../types/github'
import {
  CommentWithURLAndPathFragment,
  CommitFragment,
  getAllReferencedFragments,
  getResourceSubQuery,
  GitHubGraphQLResourceFragment,
  IssueFragment,
  PullRequestFragment,
  ReleaseFragment,
  RepositoryFragment,
} from './helpers/github'

const fixURL = (url: string, options?: GitHubURLOptions) =>
  fixURLForPlatform(url, false, options)!

export interface DevHubGitHubNotification {
  id: string | number
  isArchived: boolean
  isProbablyDeleted: boolean
  isUnreadUpstream: boolean | undefined
  lastReadAt: string | undefined
  lastSavedAt: string | undefined
  lastUnreadAt: string | undefined
  lastUnsavedAt: string | undefined
  subject: {
    type: GitHubNotificationSubjectType
    title: string
    url: string
    latestCommentURL?: string
  }
  payload: {
    comment: CommentWithURLAndPathFragment | undefined
    commit: CommitFragment | undefined
    issue: IssueFragment | undefined
    pullRequest: PullRequestFragment | undefined
    release: ReleaseFragment | undefined
    repository: RepositoryFragment & { id: string | number | undefined }
  }
  reason: GitHubNotificationReason
  updatedAt: string
}

export async function fetchNotifications({
  accessToken,
  baseAPIURL = defaultGitHubBaseAPIURL,
  before,
  onlyParticipating,
  onlyUnread,
  page = 1,
  perPage = getDefaultPaginationPerPage('notifications'),
  since,
}: {
  accessToken: string
  baseAPIURL?: string
  before?: string
  onlyParticipating?: boolean
  onlyUnread?: boolean
  page?: number
  perPage?: number
  since?: string
}): Promise<GitHubNotification[]> {
  const notificationsResponse: AxiosResponse<
    GitHubNotification[]
  > = await axios.get(
    `${baseAPIURL || defaultGitHubBaseAPIURL}/notifications?${qs.stringify(
      {
        access_token: accessToken,
        all: onlyUnread ? false : true,
        before,
        page,
        participating: onlyParticipating ? true : '',
        per_page: perPage,
        since,
      },
      {
        encode: false,
      },
    )}`,
  )
  const notifications = notificationsResponse.data
  if (!(notifications && notifications.length)) return []

  return notifications
}

export async function fetchNotificationsEnhancements(
  notifications: GitHubNotification[],
  {
    accessToken,
    baseAPIURL = defaultGitHubBaseAPIURL,
    existingNotificationsById,
    preventRefetchingExistingPayloads,
  }: {
    accessToken: string
    baseAPIURL?: string
    existingNotificationsById: Record<
      string,
      DevHubGitHubNotification | undefined
    >
    preventRefetchingExistingPayloads?: boolean
  },
): Promise<DevHubGitHubNotification[]> {
  const resourcesToFetch: Map<
    string,
    | {
        alias: string
        resourceType: GitHubGraphQLResourceFragment
        resourceURL: string
      }
    | undefined
  > = new Map()

  const resourcesToFetchByNotificationId: Record<
    string,
    | Partial<
        Record<
          GitHubGraphQLResourceFragment,
          | {
              alias: string
              resourceType: GitHubGraphQLResourceFragment
              resourceURL: string
            }
          | undefined
        >
      >
    | undefined
  > = {}

  let itemCount = 0
  function addResource(
    resourceType: GitHubGraphQLResourceFragment,
    {
      notificationId,
      resourceURL,
    }: {
      notificationId: string | number
      resourceURL: string
    },
  ): boolean {
    if (!resourceURL) {
      console.error(
        'No resource URL for notification.',
        resourceType,
        notificationId,
      )
      return false
    }

    const r = resourcesToFetch.get(resourceURL) || {
      alias: `item${++itemCount}`,
      resourceType,
      resourceURL,
    }
    resourcesToFetch.set(resourceURL, r)

    resourcesToFetchByNotificationId[notificationId] =
      resourcesToFetchByNotificationId[notificationId] || {}
    resourcesToFetchByNotificationId[notificationId]![resourceType] = r

    return true
  }

  notifications.forEach(notification => {
    const notificationId = notification.id
    const existingNotification = existingNotificationsById[notificationId]

    const repoURL =
      notification.repository.html_url || fixURL(notification.repository.url)
    if (
      !preventRefetchingExistingPayloads ||
      !(
        existingNotification &&
        existingNotification.updatedAt === notification.updated_at &&
        existingNotification.payload.repository &&
        existingNotification.payload.repository.viewerSubscription !== undefined
      )
    ) {
      addResource('Repository', { notificationId, resourceURL: repoURL })
    }

    switch (notification.subject.type) {
      case 'Commit': {
        if (
          preventRefetchingExistingPayloads &&
          existingNotification &&
          existingNotification.updatedAt === notification.updated_at &&
          existingNotification.payload.commit
        )
          break

        addResource('Commit', {
          notificationId,
          resourceURL: fixURL(notification.subject.url),
        })
        break
      }

      case 'Issue': {
        if (
          preventRefetchingExistingPayloads &&
          existingNotification &&
          existingNotification.updatedAt === notification.updated_at &&
          existingNotification.payload.issue
        )
          break

        addResource('Issue', {
          notificationId,
          resourceURL: fixURL(notification.subject.url),
        })
        break
      }

      case 'PullRequest': {
        if (
          preventRefetchingExistingPayloads &&
          existingNotification &&
          existingNotification.updatedAt === notification.updated_at &&
          existingNotification.payload.pullRequest
        )
          break

        addResource('PullRequest', {
          notificationId,
          resourceURL: fixURL(notification.subject.url),
        })
        break
      }

      case 'Release': {
        // TODO: Make normal request to v3 api, because we need the tag the use v4.
        // @see https://github.community/t5/GitHub-API-Development-and/Can-t-get-release-neither-comment-using-their-id-via-GraphQL-API/td-p/33986
        // if (
        //   preventRefetchingExistingPayloads &&
        //   existingNotification &&
        //   existingNotification.updatedAt === notification.updated_at &&
        //   existingNotification.payload.release
        // )
        //   break
        //
        // addResource('Release', {
        //   notificationId,
        //   resourceURL: fixURL(notification.subject.url),
        // })
        break
      }

      case 'RepositoryInvitation': {
        break
      }

      case 'RepositoryVulnerabilityAlert': {
        break
      }

      default: {
        break
      }
    }
  })

  const queries: string[] = []
  resourcesToFetch.forEach(r => {
    if (!r) return

    const { alias, resourceType, resourceURL } = r
    queries.push(getResourceSubQuery(resourceType, resourceURL, alias))
  })

  let query = ''
  if (queries.length) {
    query = `
      query {
        rateLimit {
          cost
          limit
          nodeCount
          remaining
          resetAt
        }

        ${queries.join('\n\n')}
      }
    `

    const fragments = getAllReferencedFragments(query)
    if (fragments) query = `${query}\n\n${fragments}`
  }

  let graphqlData: {
    [key: string]:
      | CommitFragment
      | IssueFragment
      | PullRequestFragment
      | RepositoryFragment
  } = {}

  if (query) {
    try {
      const response: AxiosResponse<{
        data: typeof graphqlData
        errors?: any[]
      }> = await axios.post(
        `${baseAPIURL || defaultGitHubBaseAPIURL}/graphql`,
        { query },
        { headers: { Authorization: `bearer ${accessToken}` } },
      )

      if (!(response.status >= 200 && response.status < 400)) {
        throw new Error(`GraphQL Error: Received status ${response.status}`)
      }

      if (response.data.errors && response.data.errors.length) {
        if (__DEV__)
          console.log('[notifications]', query, response, accessToken) // tslint:disable-line no-console
        const error = new Error(
          `GraphQL Error: ${response.data.errors
            .map(e => e.message)
            .join(';')}.`,
        )
        Object.assign(error, { query })
        throw error
      }

      graphqlData = response.data.data || {}
    } catch (error) {
      console.error(error, query)
      throw error
    }
  }

  type GetFragmentInterfaceFromFragmentKey<
    F extends GitHubGraphQLResourceFragment
  > = F extends 'Commit'
    ? DevHubGitHubNotification['payload']['commit']
    : F extends 'Issue'
    ? DevHubGitHubNotification['payload']['issue']
    : F extends 'PullRequest'
    ? DevHubGitHubNotification['payload']['pullRequest']
    : F extends 'Release'
    ? DevHubGitHubNotification['payload']['release']
    : F extends 'Repository'
    ? DevHubGitHubNotification['payload']['repository']
    : undefined

  const result = notifications.map<DevHubGitHubNotification>(notification => {
    const existingNotification = existingNotificationsById[notification.id]
    const resources = resourcesToFetchByNotificationId[notification.id]

    function getResourcePayload<F extends GitHubGraphQLResourceFragment>(
      fragmentKey: F,
    ): GetFragmentInterfaceFromFragmentKey<F> | undefined {
      let payloadKey: keyof DevHubGitHubNotification['payload'] | undefined
      switch (fragmentKey) {
        case 'Commit': {
          payloadKey = 'commit'
          break
        }

        case 'Issue': {
          payloadKey = 'issue'
          break
        }

        case 'PullRequest': {
          payloadKey = 'pullRequest'
          break
        }

        case 'Release': {
          payloadKey = 'release'
          break
        }

        case 'Repository': {
          payloadKey = 'repository'
          break
        }

        default: {
          payloadKey = undefined
        }
      }
      if (!payloadKey) return undefined

      const resource = ((resources &&
        resources[fragmentKey] &&
        graphqlData[resources[fragmentKey]!.alias]) ||
        (preventRefetchingExistingPayloads &&
          existingNotification &&
          existingNotification.updatedAt === notification.updated_at &&
          existingNotification.payload[
            payloadKey
          ])) as GetFragmentInterfaceFromFragmentKey<F>

      switch (fragmentKey) {
        case 'Commit':
          return resource
        case 'Issue':
          return resource
        case 'PullRequest':
          return resource
        case 'Release':
          return resource
        case 'Repository': {
          return {
            ...convertGitHubRepositoryToRepositoryFragment(
              notification.repository,
            ),
            ...resource,
          } as NonNullable<GetFragmentInterfaceFromFragmentKey<F>>
        }
        default:
          return undefined
      }
    }

    const partialPayload: Omit<
      DevHubGitHubNotification['payload'],
      'comment'
    > = {
      commit: getResourcePayload('Commit'),
      issue: getResourcePayload('Issue'),
      pullRequest: getResourcePayload('PullRequest'),
      release: getResourcePayload('Release'),
      repository: getResourcePayload('Repository')!,
    }
    const payload: DevHubGitHubNotification['payload'] = {
      ...partialPayload,
      comment:
        partialPayload.commit ||
        partialPayload.issue ||
        partialPayload.pullRequest
          ? (partialPayload.commit ||
              partialPayload.issue ||
              partialPayload.pullRequest)!.comments.nodes[0]
          : undefined,
    }

    return convertGitHubNotificationToDevHubGitHubNotification(notification, {
      existingNotification,
      payload,
    })
  })

  return result
}

export async function fetchEnhancedNotifications(
  params: Parameters<typeof fetchNotifications>[0] &
    Parameters<typeof fetchNotificationsEnhancements>[1],
) {
  const notifications = await fetchNotifications(params)
  return fetchNotificationsEnhancements(notifications, params)
}

export function convertGitHubRepositoryToRepositoryFragment(
  repository: GitHubNotification['repository'],
): RepositoryFragment & { id: string | number } {
  return {
    __typename: 'Repository',
    id: repository.id,
    isFork: false,
    isPrivate: repository.private,
    nameWithOwner:
      repository.full_name || getRepoFullNameFromUrl(repository.url)!,
    name: repository.name.split('/').slice(-1)[0],
    nodeId: repository.node_id,
    owner: (repository.owner && {
      __typename: repository.owner.type as any,
      avatarUrl: repository.owner.avatar_url,
      login: repository.owner.login,
      nodeId: repository.owner.node_id!,
      url: repository.owner.html_url || fixURL(repository.owner.url),
    })!,
    url: repository.html_url || fixURL(repository.url),
    viewerSubscription: undefined,
  }
}

export function convertGitHubNotificationToDevHubGitHubNotification(
  notification: GitHubNotification,
  {
    existingNotification,
    payload,
  }: {
    existingNotification?: DevHubGitHubNotification
    payload?: Partial<DevHubGitHubNotification['payload']>
  },
): DevHubGitHubNotification {
  return {
    id: notification.id,
    isArchived: !!(existingNotification && existingNotification.isArchived),
    isProbablyDeleted: !!(
      existingNotification && existingNotification.isProbablyDeleted
    ),
    isUnreadUpstream: notification.unread,
    lastSavedAt: existingNotification && existingNotification.lastSavedAt,
    lastUnsavedAt: existingNotification && existingNotification.lastUnsavedAt,
    lastReadAt: _.max([
      existingNotification && existingNotification.lastReadAt,
      notification.last_read_at,
    ]),
    lastUnreadAt: existingNotification && existingNotification.lastUnreadAt,
    subject: {
      latestCommentURL:
        (payload && payload.comment && payload.comment.url) ||
        (notification.subject.latest_comment_url &&
          fixURL(notification.subject.latest_comment_url, {
            addBottomAnchor: !(payload && payload.release),
            commentId:
              getCommentIdFromUrl(notification.subject.latest_comment_url) ||
              undefined,
            commentIsInline: !!(
              payload &&
              payload.comment &&
              payload.comment.path
            ),
            issueOrPullRequestNumber:
              (payload && payload.issue && payload.issue.number) ||
              (payload && payload.pullRequest && payload.pullRequest.number) ||
              getIssueOrPullRequestNumberFromUrl(notification.subject.url),
            tagName: payload && payload.release && payload.release.tagName,
          })),
      title: notification.subject.title,
      type: notification.subject.type,
      url: fixURL(notification.subject.url),
    },
    payload: {
      comment: undefined,
      commit: undefined,
      issue: undefined,
      pullRequest: undefined,
      release: undefined,
      ...(existingNotification && existingNotification.payload),
      ...payload,
      repository:
        (payload && payload.repository) ||
        (existingNotification &&
          existingNotification.payload &&
          existingNotification.payload.repository) ||
        convertGitHubRepositoryToRepositoryFragment(notification.repository),
    },
    reason: notification.reason,
    updatedAt: notification.updated_at,
  }
}

// TODO: This should be temporary.
// All other files were made for the rest api response format,
// so it was easier to make this change here instead of dozens of files.
// But ideally all project should be converted to the GraphQL response format.
export function convertDevHubGitHubNotificationToOldEnhancedGitHubNotification(
  notification: DevHubGitHubNotification,
): EnhancedGitHubNotification {
  return {
    comment: notification.payload.comment && {
      body: notification.payload.comment.bodyText,
      created_at: notification.payload.comment.createdAt,
      id: notification.payload.comment.nodeId,
      html_url: notification.payload.comment.url,
      updated_at: notification.payload.comment.updatedAt,
      url: notification.payload.comment.url,
      user: notification.payload.comment.author && {
        id: '',
        avatar_url: notification.payload.comment.author.avatarUrl,
        login: notification.payload.comment.author.login,
        node_id: notification.payload.comment.author.nodeId,
        html_url: notification.payload.comment.author.url,
        url: notification.payload.comment.author.url,
      },
    },
    enhanced:
      notification.subject.type === 'Commit'
        ? !!notification.payload.commit
        : notification.subject.type === 'Issue' ||
          notification.subject.type === 'PullRequest'
        ? !!(notification.payload.issue || notification.payload.pullRequest)
        : // : notification.subject.type === 'Release' // TODO
          // ? !!notification.payload.release
          !!(
            notification.payload.repository &&
            notification.payload.repository.viewerSubscription !== undefined
          ),
    commit: notification.payload.commit && {
      author: notification.payload.commit.author && {
        avatar_url: notification.payload.commit.author.avatarUrl,
        email: notification.payload.commit.author.email,
        name: notification.payload.commit.author.name,
        login:
          (notification.payload.commit.author.user &&
            notification.payload.commit.author.user.login) ||
          '',
        html_url:
          (notification.payload.commit.author.user &&
            notification.payload.commit.author.user.url) ||
          undefined,
      },
      commit: {
        author: notification.payload.commit.author && {
          name: notification.payload.commit.author.name,
          email: notification.payload.commit.author.email || '',
          date: notification.payload.commit.author.date,
        },
        message: notification.payload.commit.messageHeadline,
        comment_count: notification.payload.commit.comments.totalCount,
        committer: notification.payload.commit.committer && {
          name: notification.payload.commit.committer.name,
          email: notification.payload.commit.committer.email || '',
          date: notification.payload.commit.committer.date,
        },
        url: notification.payload.commit.url,
      },
      committer: notification.payload.commit.committer && {
        avatar_url: notification.payload.commit.committer.avatarUrl,
        email: notification.payload.commit.committer.email,
        name: notification.payload.commit.committer.name,
        login:
          (notification.payload.commit.committer.user &&
            notification.payload.commit.committer.user.login) ||
          '',
        html_url:
          (notification.payload.commit.committer.user &&
            notification.payload.commit.committer.user.url) ||
          undefined,
      },
      sha: notification.payload.commit.oid,
      node_id: notification.payload.commit.nodeId,
      html_url: notification.payload.commit.url,
      url: '',
    },
    id: notification.id,
    issue: notification.payload.issue && {
      assignee:
        (notification.payload.issue.assignees.nodes.length === 1 &&
          notification.payload.issue.assignees.nodes[0] && {
            avatar_url: notification.payload.issue.assignees.nodes[0].avatarUrl,
            html_url: notification.payload.issue.assignees.nodes[0].url,
            id: '',
            login: notification.payload.issue.assignees.nodes[0].login,
            node_id: notification.payload.issue.assignees.nodes[0].nodeId,
            url: '',
          }) ||
        undefined,
      assignees: notification.payload.issue.assignees.nodes.map(assignee => ({
        avatar_url: assignee.avatarUrl,
        html_url: assignee.url,
        id: '',
        login: assignee.login,
        node_id: assignee.nodeId,
        url: '',
      })),
      body: notification.payload.issue.bodyText,
      closed_at: notification.payload.issue.closedAt,
      comments: notification.payload.issue.comments.totalCount,
      created_at: notification.payload.issue.createdAt,
      draft: false, // TODO: @see https://github.community/t5/GitHub-API-Development-and/GraphQL-API-should-have-a-isDraft-field-for-Pull-Requests/m-p/33798/highlight/true#M3179
      html_url: notification.payload.issue.url,
      id: '',
      labels: notification.payload.issue.labels.nodes.map(label => ({
        id: '',
        node_id: label.nodeId,
        name: label.name,
        color: label.color,
        default: label.isDefault,
        url: label.url,
      })),
      locked: notification.payload.issue.locked,
      node_id: notification.payload.issue.nodeId,
      number: notification.payload.issue.number,
      repository_url: notification.payload.repository.url,
      state: notification.payload.issue.state === 'CLOSED' ? 'closed' : 'open',
      title: notification.payload.issue.title,
      updated_at: notification.payload.issue.updatedAt,
      user: notification.payload.issue.author && {
        avatar_url: notification.payload.issue.author.avatarUrl,
        html_url: notification.payload.issue.author.url,
        id: '',
        login: notification.payload.issue.author.login,
        node_id: notification.payload.issue.author.nodeId,
        url: '',
      },
      url: '',
    },
    last_read_at: notification.lastReadAt,
    last_unread_at: notification.lastUnreadAt,
    pullRequest: notification.payload.pullRequest && {
      assignee:
        (notification.payload.pullRequest.assignees.nodes.length === 1 &&
          notification.payload.pullRequest.assignees.nodes[0] && {
            avatar_url:
              notification.payload.pullRequest.assignees.nodes[0].avatarUrl,
            html_url: notification.payload.pullRequest.assignees.nodes[0].url,
            id: '',
            login: notification.payload.pullRequest.assignees.nodes[0].login,
            node_id: notification.payload.pullRequest.assignees.nodes[0].nodeId,
            url: '',
          }) ||
        undefined,
      assignees: notification.payload.pullRequest.assignees.nodes.map(
        assignee => ({
          avatar_url: assignee.avatarUrl,
          html_url: assignee.url,
          id: '',
          login: assignee.login,
          node_id: assignee.nodeId,
          url: '',
        }),
      ),
      body: notification.payload.pullRequest.bodyText,
      closed_at: notification.payload.pullRequest.closedAt,
      comments: notification.payload.pullRequest.comments.totalCount,
      created_at: notification.payload.pullRequest.createdAt,
      draft: false, // TODO: @see https://github.community/t5/GitHub-API-Development-and/GraphQL-API-should-have-a-isDraft-field-for-Pull-Requests/m-p/33798/highlight/true#M3179
      html_url: notification.payload.pullRequest.url,
      id: '',
      labels: notification.payload.pullRequest.labels.nodes.map(label => ({
        id: '',
        node_id: label.nodeId,
        name: label.name,
        color: label.color,
        default: label.isDefault,
        url: label.url,
      })),
      locked: notification.payload.pullRequest.locked,
      merged: notification.payload.pullRequest.state === 'MERGED',
      node_id: notification.payload.pullRequest.nodeId,
      merged_at: notification.payload.pullRequest.mergedAt,
      merged_by: notification.payload.pullRequest.mergedBy && {
        avatar_url: notification.payload.pullRequest.mergedBy.avatarUrl,
        html_url: notification.payload.pullRequest.mergedBy.url,
        id: '',
        login: notification.payload.pullRequest.mergedBy.login,
        node_id: notification.payload.pullRequest.mergedBy.nodeId,
        url: '',
      },
      number: notification.payload.pullRequest.number,
      repository_url: notification.payload.repository.url,
      state:
        notification.payload.pullRequest.state === 'MERGED' ||
        notification.payload.pullRequest.state === 'CLOSED'
          ? 'closed'
          : 'open',
      title: notification.payload.pullRequest.title,
      updated_at: notification.payload.pullRequest.updatedAt,
      user: notification.payload.pullRequest.author && {
        avatar_url: notification.payload.pullRequest.author.avatarUrl,
        html_url: notification.payload.pullRequest.author.url,
        id: '',
        login: notification.payload.pullRequest.author.login,
        node_id: notification.payload.pullRequest.author.nodeId,
        url: '',
      },
      url: '',
    },
    reason: notification.reason,
    release: notification.payload.release && {
      body: notification.payload.release.description,
      created_at: notification.payload.release.createdAt,
      draft: notification.payload.release.isDraft,
      html_url: notification.payload.release.url,
      id: '',
      name: notification.payload.release.name,
      prerelease: notification.payload.release.isPrerelease,
      published_at: notification.payload.release.publishedAt,
      tag_name: notification.payload.release.tagName,
      url: '',
      author: {
        avatar_url: notification.payload.release.author.avatarUrl,
        id: '',
        login: notification.payload.release.author.login,
        node_id: notification.payload.release.author.nodeId,
      },
    },
    repository: {
      fork: notification.payload.repository.isFork,
      full_name: notification.payload.repository.nameWithOwner,
      html_url: notification.payload.repository.url,
      id: notification.payload.repository.id || '',
      name: notification.payload.repository.name,
      node_id: notification.payload.repository.nodeId,
      private: notification.payload.repository.isPrivate,
      url: '',
    },
    last_saved_at: notification.lastSavedAt,
    last_unsaved_at: notification.lastUnsavedAt,
    subject: {
      latest_comment_url:
        (notification.payload.comment && notification.payload.comment.url) ||
        notification.subject.latestCommentURL,
      title: notification.subject.title,
      type: notification.subject.type,
      url: notification.subject.url,
    },
    unread: notification.isUnreadUpstream,
    updated_at: notification.updatedAt,
    url: '',
  }
}
