import immer from 'immer'
import _ from 'lodash'
import moment from 'moment'

import {
  EnhancedGitHubEvent,
  GitHubComment,
  GitHubCommitCommentEvent,
  GitHubEnhancedEventBase,
  GitHubEvent,
  GitHubEventAction,
  GitHubEventSubjectType,
  GitHubForkEvent,
  GitHubGollumEvent,
  GitHubIcon,
  GitHubIssue,
  GitHubIssuesEvent,
  GitHubMemberEvent,
  GitHubPage,
  GitHubPullRequest,
  GitHubPullRequestEvent,
  GitHubPushedCommit,
  GitHubPushEvent,
  GitHubReleaseEvent,
  GitHubRepo,
  GitHubUser,
  MultipleStarEvent,
  ThemeColors,
  UserPlan,
} from '../../types'
import { constants } from '../../utils'
import { isEventPrivate } from '../shared'
import {
  getCommitIconAndColor,
  getIssueIconAndColor,
  getItemIsBot,
  getNameFromRef,
  getOwnerAndRepo,
  getPullRequestIconAndColor,
  getReleaseIconAndColor,
  getTagIconAndColor,
  isDraft,
  isItemRead,
  isPullRequest,
} from './shared'
import {
  getGitHubAvatarURLFromPayload,
  getGitHubURLForRepo,
  getIssueOrPullRequestNumberFromUrl,
  getRepoFullNameFromObject,
  getRepoFullNameFromUrl,
} from './url'

export const eventActions: GitHubEventAction[] = [
  'added',
  'closed',
  'commented',
  'created',
  'deleted',
  'forked',
  'merged',
  'opened',
  'pushed',
  'released',
  'reopened',
  'reviewed',
  'starred',
  'updated',
]

export const eventSubjectTypes: GitHubEventSubjectType[] = [
  'Branch',
  'Commit',
  'Issue',
  'PullRequest',
  'PullRequestReview',
  'Release',
  'Repository',
  'Tag',
  'User',
  'Wiki',
]

export function getOlderEventDate(
  items: EnhancedGitHubEvent[],
  ignoreFutureDates = true,
) {
  const now = Date.now()
  return sortEvents(items, 'created_at', 'asc')
    .map(item => item.created_at)
    .filter(
      date =>
        !!(date && ignoreFutureDates ? now > new Date(date).getTime() : true),
    )[0]
}

export function getEventActionMetadata<T extends GitHubEventAction>(
  action: T,
): { label: string; action: T } {
  return { label: _.capitalize(_.startCase(action)), action }
}

export function getEventMetadata(
  event: EnhancedGitHubEvent,
  options:
    | {
        appendColon?: boolean
        commitIsKnown?: boolean
        includeBranch?: boolean
        includeFork?: boolean
        includeRepo?: boolean
        includeTag?: boolean
        includeUser?: boolean
        issueOrPullRequestIsKnown?: boolean
        ownerIsKnown?: boolean
        repoIsKnown?: boolean
      }
    | undefined = {},
): {
  action: GitHubEventAction | undefined
  actionText: string
  subjectType: GitHubEventSubjectType | undefined
} {
  const {
    appendColon,
    commitIsKnown,
    includeBranch,
    includeFork,
    includeRepo,
    includeTag,
    includeUser,
    issueOrPullRequestIsKnown,
    ownerIsKnown,
    repoIsKnown,
  } = options

  const repoFullName =
    ('repo' in event && getRepoFullNameFromObject(event.repo)) ||
    ('repos' in event && getRepoFullNameFromObject(event.repos[0]))

  const isDraftPR =
    ('pull_request' in event.payload && isDraft(event.payload.pull_request)) ||
    ('issue' in event.payload &&
      isPullRequest(event.payload.issue) &&
      isDraft(event.payload.issue as GitHubPullRequest))

  const issueText = issueOrPullRequestIsKnown ? 'this issue' : 'an issue'
  const pullRequestText = issueOrPullRequestIsKnown
    ? `this ${isDraftPR ? 'draft pr' : 'pr'}`
    : `a ${isDraftPR ? 'draft pr' : 'pr'}`
  let repositoryText = repoIsKnown
    ? 'this repository'
    : (includeRepo && repoFullName) || 'a repository'

  if (ownerIsKnown && repositoryText === repoFullName) {
    const { owner } = getOwnerAndRepo(repositoryText)
    if (owner) repositoryText = repositoryText.replace(`${owner}/`, '')
  }

  const colonText = appendColon ? ':' : ''

  const issueTextWithColon = issueOrPullRequestIsKnown
    ? issueText
    : `${issueText}${colonText}`
  const pullRequestTextWithColon = issueOrPullRequestIsKnown
    ? pullRequestText
    : `${pullRequestText}${colonText}`
  const repositoryTextWithColon = repoIsKnown
    ? repositoryText
    : `${repositoryText}${colonText}`

  const result = ((): {
    action: GitHubEventAction | undefined
    actionText: string
    subjectType: GitHubEventSubjectType | undefined
  } => {
    switch (event.type) {
      case 'CommitCommentEvent': {
        return {
          action: 'commented',
          actionText: `Commented on commit${colonText}`,
          subjectType: 'Commit',
        }
      }
      case 'CreateEvent': {
        switch (event.payload.ref_type) {
          case 'repository':
            return {
              action: 'created',
              actionText: `Created ${repositoryTextWithColon}`,
              subjectType: 'Repository',
            }
          case 'branch': {
            const branch = getNameFromRef(event.payload.ref || undefined)
            return {
              action: 'created',
              actionText:
                includeBranch && branch
                  ? `Created branch ${branch}`
                  : `Created a branch${colonText}`,
              subjectType: 'Branch',
            }
          }
          case 'tag': {
            const tag = event.payload.ref
            return {
              action: 'created',
              actionText:
                includeTag && tag
                  ? `Created tag ${tag}`
                  : `Created a tag${colonText}`,
              subjectType: 'Tag',
            }
          }
          default:
            return {
              action: 'created',
              actionText: 'Created something',
              subjectType: undefined,
            }
        }
      }

      case 'DeleteEvent': {
        switch (event.payload.ref_type) {
          case 'repository':
            return {
              action: 'deleted',
              actionText: `Deleted ${repositoryTextWithColon}`,
              subjectType: 'Repository',
            }
          case 'branch': {
            const branch = getNameFromRef(event.payload.ref)
            return {
              action: 'deleted',
              actionText:
                includeBranch && branch
                  ? `Deleted branch ${branch}`
                  : `Deleted a branch${colonText}`,
              subjectType: 'Branch',
            }
          }
          case 'tag': {
            const tag = event.payload.ref
            return {
              action: 'deleted',
              actionText:
                includeTag && tag
                  ? `Deleted tag ${tag}`
                  : `Deleted a tag${colonText}`,
              subjectType: 'Tag',
            }
          }
          default:
            return {
              action: 'deleted',
              actionText: 'Deleted something',
              subjectType: undefined,
            }
        }
      }

      case 'ForkEvent': {
        const fork = event.payload.forkee
        const forkFullName =
          fork && (fork.full_name || getRepoFullNameFromObject(fork))
        const isSameName =
          forkFullName &&
          forkFullName.split('/')[1] === repositoryText.split('/')[1]

        return {
          action: 'forked',
          actionText: includeFork
            ? `Forked ${repositoryText}${
                !repoIsKnown && forkFullName && !isSameName
                  ? ` to ${forkFullName}`
                  : ''
              }`
            : `Forked ${repositoryTextWithColon}`,
          subjectType: 'Repository',
        }
      }

      case 'GollumEvent': {
        const count = (event.payload.pages || []).length || 1
        const pagesText = count > 1 ? `${count} wiki pages` : 'a wiki page'
        switch (
          event.payload.pages &&
            event.payload.pages[0] &&
            event.payload.pages[0].action
        ) {
          case 'created': {
            return {
              action: 'created',
              actionText: `Created ${pagesText}${colonText}`,
              subjectType: 'Wiki',
            }
          }

          case 'edited': {
            return {
              action: 'updated',
              actionText: `Edited ${pagesText}${colonText}`,
              subjectType: 'Wiki',
            }
          }

          default:
            return {
              action: 'updated',
              actionText: `Updated ${pagesText}${colonText}`,
              subjectType: 'Wiki',
            }
        }
      }

      case 'IssueCommentEvent': {
        return {
          action: 'commented',
          actionText: `Commented on ${
            isPullRequest(event.payload.issue)
              ? pullRequestTextWithColon
              : issueTextWithColon
          }`,
          subjectType: isPullRequest(event.payload.issue)
            ? 'PullRequest'
            : 'Issue',
        }
      }

      case 'IssuesEvent': {
        const subjectType: GitHubEventSubjectType = isPullRequest(
          event.payload.issue,
        )
          ? 'PullRequest'
          : 'Issue'

        switch (event.payload.action) {
          case 'closed':
            return {
              action: 'closed',
              actionText: `Closed ${issueTextWithColon}`,
              subjectType,
            }
          case 'reopened':
            return {
              action: 'reopened',
              actionText: `Reopened ${issueTextWithColon}`,
              subjectType,
            }
          case 'opened':
            return {
              action: 'opened',
              actionText: `Opened ${issueTextWithColon}`,
              subjectType,
            }
          case 'assigned':
            return {
              action: 'updated',
              actionText: `Assigned ${issueTextWithColon}`,
              subjectType,
            }
          case 'unassigned':
            return {
              action: 'updated',
              actionText: `Unassigned ${issueTextWithColon}`,
              subjectType,
            }
          case 'labeled':
            return {
              action: 'updated',
              actionText: `Labeled ${issueTextWithColon}`,
              subjectType,
            }
          case 'unlabeled':
            return {
              action: 'updated',
              actionText: `Unlabeled ${issueTextWithColon}`,
              subjectType,
            }
          case 'edited':
            return {
              action: 'updated',
              actionText: `Edited ${issueTextWithColon}`,
              subjectType,
            }
          case 'milestoned':
            return {
              action: 'updated',
              actionText: `Milestoned ${issueTextWithColon}`,
              subjectType,
            }
          case 'demilestoned':
            return {
              action: 'updated',
              actionText: `Demilestoned ${issueTextWithColon}`,
              subjectType,
            }
          default: {
            console.error('Unknown IssuesEvent action', event.payload.action)
            return {
              action: 'updated',
              actionText: `Updated ${issueTextWithColon}`,
              subjectType,
            }
          }
        }
      }

      case 'MemberEvent': {
        const username = event.payload.member && event.payload.member.login
        return {
          action: 'added',
          actionText:
            includeUser && username
              ? `Added @${username} to ${repositoryTextWithColon}`
              : `Added a user to ${repositoryTextWithColon}`,
          subjectType: 'User',
        }
      }

      case 'PublicEvent': {
        return {
          action: 'created',
          actionText: `Made ${repositoryText} public`,
          subjectType: 'Repository',
        }
      }

      case 'PullRequestEvent': {
        const subjectType: GitHubEventSubjectType = 'PullRequest'

        switch (event.payload.action) {
          case 'assigned':
            return {
              action: 'updated',
              actionText: `Assigned ${pullRequestTextWithColon}`,
              subjectType,
            }
          case 'unassigned':
            return {
              action: 'updated',
              actionText: `Unassigned ${pullRequestTextWithColon}`,
              subjectType,
            }
          case 'labeled':
            return {
              action: 'updated',
              actionText: `Labeled ${pullRequestTextWithColon}`,
              subjectType,
            }
          case 'unlabeled':
            return {
              action: 'updated',
              actionText: `Unlabeled ${pullRequestTextWithColon}`,
              subjectType,
            }
          case 'opened':
            return {
              action: 'opened',
              actionText: `Opened ${pullRequestTextWithColon}`,
              subjectType,
            }
          case 'edited':
            return {
              action: 'updated',
              actionText: `Edited ${pullRequestTextWithColon}`,
              subjectType,
            }

          case 'closed': {
            const isMerged = !!(
              event.payload.pull_request.merged ||
              event.payload.pull_request.merged_at
            )

            return {
              action: isMerged ? 'merged' : 'closed',
              actionText: isMerged
                ? `Merged ${pullRequestTextWithColon}`
                : `Closed ${pullRequestTextWithColon}`,
              subjectType,
            }
          }

          case 'reopened':
            return {
              action: 'reopened',
              actionText: `Reopened ${pullRequestTextWithColon}`,
              subjectType,
            }
          default: {
            console.error(
              'Unknown PullRequestEvent action',
              event.payload.action,
            )
            return {
              action: 'updated',
              actionText: `Updated ${pullRequestTextWithColon}`,
              subjectType,
            }
          }
        }
      }

      case 'PullRequestReviewEvent': {
        return {
          action: 'reviewed',
          actionText: `Reviewed ${pullRequestTextWithColon}`,
          subjectType: 'PullRequestReview',
        }
      }

      case 'PullRequestReviewCommentEvent': {
        switch (event.payload.action) {
          case 'created':
            return {
              action: 'reviewed',
              actionText: `Commented on ${pullRequestText} review${colonText}`,
              subjectType: 'PullRequestReview',
            }
          case 'edited':
            return {
              action: 'updated',
              actionText: `Edited ${pullRequestText} review${colonText}`,
              subjectType: 'PullRequestReview',
            }
          case 'deleted':
            return {
              action: 'deleted',
              actionText: `Deleted ${pullRequestText} review${colonText}`,
              subjectType: 'PullRequestReview',
            }
          default: {
            console.error(
              'Unknown PullRequestReviewCommentEvent action',
              event.payload.action,
            )
            return {
              action: 'reviewed',
              actionText: `Updated ${pullRequestText} review${colonText}`,
              subjectType: 'PullRequestReview',
            }
          }
        }
      }

      case 'PushEvent': {
        const commits = event.payload.commits || [{}]
        const count = Math.max(
          commits.length || 1,
          event.payload.distinct_size || 1,
          event.payload.size || 1,
        )

        const branch = getNameFromRef(event.payload.ref)
        const pushedText = event.forced ? 'Force pushed' : 'Pushed'
        const commitText =
          count > 1
            ? ` ${count} commits`
            : commitIsKnown
            ? ' this commit'
            : ' a commit'
        const branchText = includeBranch && branch ? ` to ${branch}` : ''

        return {
          action: 'pushed',
          actionText: `${pushedText}${commitText}${branchText}${colonText}`,
          subjectType: 'Commit',
        }
      }

      case 'ReleaseEvent': {
        return {
          action: 'released',
          actionText: `Published a release${colonText}`,
          subjectType: 'Release',
        }
      }

      case 'WatchEvent': {
        return {
          action: 'starred',
          actionText: `Starred ${repositoryTextWithColon}`,
          subjectType: 'Repository',
        }
      }

      case 'WatchEvent:OneUserMultipleRepos': {
        return {
          action: 'starred',
          actionText:
            event.repos.length > 1
              ? `Starred ${event.repos.length} repositories${colonText}`
              : `Starred ${repositoryTextWithColon}`,
          subjectType: 'Repository',
        }
      }

      default: {
        console.error('Unknown event type', (event as any).type)
        return {
          action: undefined,
          actionText: 'Did something',
          subjectType: undefined,
        }
      }
    }
  })()

  return {
    ...result,
    actionText: result.actionText.replace(/ {2}/g, ' ').trim(),
  }
}

function tryMerge(
  eventA: EnhancedGitHubEvent,
  eventB: EnhancedGitHubEvent,
  maxLength: number,
) {
  if (!eventA || !eventB) return null

  const isSameUser =
    eventA.actor && eventB.actor && eventA.actor.id === eventB.actor.id

  const isSameRepo =
    'repo' in eventA &&
    eventA.repo &&
    ('repo' in eventB && eventB.repo && eventA.repo.id === eventB.repo.id)

  const createdAtMinutesDiff = moment(eventA.created_at).diff(
    moment(eventB.created_at),
    'minutes',
  )

  // only merge events from the same user
  if (!isSameUser) return null

  // only merge events that were created in the same hour
  if (createdAtMinutesDiff >= 24 * 60) return null

  // only merge 5 events at max
  if ('merged' in eventA && eventA.merged && eventA.merged.length >= maxLength)
    return null

  switch (eventA.type) {
    case 'WatchEvent': {
      if (eventB.type === 'WatchEvent') {
        if (isSameRepo) return eventB

        return {
          ..._.omit(eventA, ['repo', 'type']),
          type: 'WatchEvent:OneUserMultipleRepos',
          repos: [eventA.repo, eventB.repo],
          merged: [eventA.id, eventB.id],
        } as MultipleStarEvent
      }

      return null
    }

    case 'WatchEvent:OneUserMultipleRepos': {
      const repoBId = 'repo' in eventB && eventB.repo && eventB.repo.id
      const alreadyMergedThisRepo = eventA.repos.find(
        repo => repo.id === repoBId,
      )
      if (eventB.type === 'WatchEvent') {
        return {
          ...eventA,
          repos: _.uniqBy([...eventA.repos, eventB.repo], repo => repo.id),
          merged: alreadyMergedThisRepo
            ? _.uniq(eventA.merged)
            : _.uniq([...eventA.merged, eventB.id]),
        } as MultipleStarEvent
      }

      return null
    }

    default:
      return null
  }
}

export function mergeSimilarEvents(
  events: EnhancedGitHubEvent[],
  maxLength: number,
) {
  const enhancedEvents: EnhancedGitHubEvent[] = []

  let enhancedEvent: EnhancedGitHubEvent | null = null

  events.filter(Boolean).forEach(event => {
    if (!enhancedEvent) {
      enhancedEvent = event
      return
    }

    const mergedEvent = tryMerge(enhancedEvent, event, maxLength)

    if (!mergedEvent) {
      enhancedEvents.push(enhancedEvent)
      enhancedEvent = event
      return
    }

    enhancedEvent = mergedEvent
  })

  if (enhancedEvent) enhancedEvents.push(enhancedEvent)

  const result =
    enhancedEvents.length === events.length ? events : enhancedEvents
  return result && result.length ? result : constants.EMPTY_ARRAY
}

export function isBranchMainEvent(event: EnhancedGitHubEvent) {
  if (!(event && event.type)) return false

  return (
    getEventMetadata(event).subjectType === 'Branch' ||
    event.type === 'PushEvent'
  )
}

export function isTagMainEvent(event: EnhancedGitHubEvent) {
  if (!(event && event.type)) return false

  return getEventMetadata(event).subjectType === 'Tag'
}

export function sortEvents(
  events: EnhancedGitHubEvent[] | undefined,
  field: keyof EnhancedGitHubEvent = 'created_at',
  order: 'asc' | 'desc' = 'desc',
): EnhancedGitHubEvent[] {
  if (!(events && events.length)) return constants.EMPTY_ARRAY

  return _(events)
    .uniqBy('id')
    .orderBy(field, order)
    .value()
}

export function getEventIconAndColor(
  event: EnhancedGitHubEvent,
): { color?: keyof ThemeColors; icon: GitHubIcon; subIcon?: GitHubIcon } {
  switch (event.type) {
    case 'CommitCommentEvent':
      return {
        ...getCommitIconAndColor(),
        subIcon: 'comment-discussion',
      }

    case 'CreateEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return { icon: 'repo' }
        case 'branch':
          return { icon: 'git-branch' }
        case 'tag':
          return { icon: 'tag' }
        default:
          return { icon: 'plus' }
      }
    }

    case 'DeleteEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return { icon: 'repo', color: 'lightRed' }
        case 'branch':
          return { icon: 'git-branch', color: 'lightRed' }
        case 'tag':
          return { icon: 'tag', color: 'lightRed' }
        default:
          return { icon: 'trashcan' }
      }
    }

    case 'ForkEvent':
      return { icon: 'repo-forked' }

    case 'GollumEvent':
      return { icon: 'book' }

    case 'IssueCommentEvent': {
      return {
        ...(isPullRequest(event.payload.issue)
          ? getPullRequestIconAndColor(event.payload.issue as GitHubPullRequest)
          : getIssueIconAndColor(event.payload.issue)),
        subIcon: 'comment-discussion',
      }
    }

    case 'IssuesEvent': {
      const issue = event.payload.issue

      switch (event.payload.action) {
        case 'opened':
          return getIssueIconAndColor({ state: 'open' } as GitHubIssue)
        case 'closed':
          return getIssueIconAndColor({ state: 'closed' } as GitHubIssue)

        case 'reopened':
          return {
            ...getIssueIconAndColor({ state: 'open' } as GitHubIssue),
            icon: 'issue-reopened',
          }
        // case 'assigned':
        // case 'unassigned':
        // case 'labeled':
        // case 'unlabeled':
        // case 'edited':
        // case 'milestoned':
        // case 'demilestoned':
        default:
          return getIssueIconAndColor(issue)
      }
    }
    case 'MemberEvent':
      return { icon: 'person' }

    case 'PublicEvent':
      return { icon: 'globe', color: 'blue' }

    case 'PullRequestEvent': {
      const pullRequest = event.payload.pull_request

      switch (event.payload.action) {
        case 'opened':
        case 'reopened':
          return getPullRequestIconAndColor({
            draft: pullRequest.draft,
            state: 'open',
            merged: false,
            merged_at: undefined,
            mergeable_state: pullRequest.mergeable_state,
          })
        // case 'closed': return getPullRequestIconAndColor({ state: 'closed' } as GitHubPullRequest);

        // case 'assigned':
        // case 'unassigned':
        // case 'labeled':
        // case 'unlabeled':
        // case 'edited':
        default:
          return getPullRequestIconAndColor(pullRequest)
      }
    }

    case 'PullRequestReviewCommentEvent':
    case 'PullRequestReviewEvent': {
      return {
        ...getPullRequestIconAndColor(event.payload.pull_request),
        subIcon: 'comment-discussion',
      }
    }

    case 'PushEvent':
      return {
        icon: 'code',
      }

    case 'ReleaseEvent':
      return isTagMainEvent(event)
        ? getTagIconAndColor()
        : getReleaseIconAndColor()

    case 'WatchEvent':
    case 'WatchEvent:OneUserMultipleRepos':
      return { icon: 'star', color: 'yellow' }

    default: {
      const message = `Unknown event type: ${(event as any).type}`
      console.error(message)
      return { icon: 'mark-github' }
    }
  }
}

export function mergeEventsPreservingEnhancement(
  newItems: EnhancedGitHubEvent[],
  prevItems: EnhancedGitHubEvent[],
  { dropPrevItems }: { dropPrevItems?: boolean } = {},
) {
  const allItems = dropPrevItems
    ? newItems || []
    : _.concat(newItems || [], prevItems || [])

  return sortEvents(
    _.uniqBy(allItems, 'id').map(item => {
      const newItem = newItems.find(i => i.id === item.id)
      const existingItem = prevItems.find(i => i.id === item.id)

      return mergeEventPreservingEnhancement(newItem!, existingItem)
    }),
  )
}

export function mergeEventPreservingEnhancement(
  newItem: EnhancedGitHubEvent,
  existingItem: EnhancedGitHubEvent | undefined,
) {
  if (!(newItem && existingItem)) return newItem || existingItem

  delete newItem.last_read_at
  delete newItem.last_unread_at

  const enhancements: Record<
    keyof Omit<EnhancedGitHubEvent, keyof GitHubEvent>,
    any
  > = {
    enhanced: existingItem.enhanced,
    forceUnreadLocally: existingItem.forceUnreadLocally,
    last_read_at: _.max([existingItem.last_read_at, newItem.last_read_at]),
    last_unread_at: _.max([
      existingItem.last_unread_at,
      newItem.last_unread_at,
    ]),
    saved: existingItem.saved,
    unread: existingItem.unread,
  }

  return immer(newItem, draft => {
    Object.entries(enhancements).forEach(([key, value]) => {
      if (typeof value === 'undefined') return
      if (value === (draft as any)[key]) return
      if (typeof (draft as any)[key] !== 'undefined') return
      ;(draft as any)[key] = value
    })
  })
}

export function getGitHubEventSubItems(
  event: EnhancedGitHubEvent,
  { plan }: { plan: UserPlan | null | undefined },
) {
  const {
    actor,
    payload,
    id,
    saved,
    type,
    created_at: createdAt,
  } = event as EnhancedGitHubEvent
  const { merged: mergedIds } = event as GitHubEnhancedEventBase
  const { repo: _repo } = event as GitHubEvent
  const { repos: _repos } = event as MultipleStarEvent

  const comment:
    | GitHubComment
    | undefined = (payload as GitHubCommitCommentEvent['payload']).comment
  const { commits: _commits } = payload as GitHubPushEvent['payload']
  const forkee: GitHubRepo | undefined = (payload as GitHubForkEvent['payload'])
    .forkee
  const { member: _member } = payload as GitHubMemberEvent['payload']
  const { release } = payload as GitHubReleaseEvent['payload']
  const { pages: _pages } = payload as GitHubGollumEvent['payload']
  const {
    pull_request: pullRequest,
  } = payload as GitHubPullRequestEvent['payload']
  const { issue } = payload as GitHubIssuesEvent['payload']
  const { ref: branchOrTagRef } = payload as GitHubPushEvent['payload']

  const branchOrTagName = getNameFromRef(branchOrTagRef)

  const issueOrPullRequest = (issue || pullRequest) as
    | typeof issue
    | typeof pullRequest
    | undefined

  const issueOrPullRequestNumber = issueOrPullRequest
    ? issueOrPullRequest.number ||
      getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
    : undefined

  const isRead = isItemRead(event)
  const isSaved = saved === true

  const commits: GitHubPushedCommit[] = (_commits || []).filter(Boolean)

  const repos: GitHubRepo[] = (_repos || [_repo]).filter(r => {
    if (!(r && r.name)) return false

    const or = getOwnerAndRepo(r.name)
    return !!(or.owner && or.repo)
  })

  // ugly and super edge case workaround for repo not being returned on some commit events
  if (!repos.length && commits[0]) {
    const _repoFullName = getRepoFullNameFromUrl(commits[0].url)
    const { owner, repo: name } = getOwnerAndRepo(_repoFullName)
    if (owner && name) {
      repos.push({
        id: '',
        fork: false,
        private: false,
        full_name: _repoFullName,
        owner: { login: name } as any,
        name,
        url: getGitHubURLForRepo(owner, name)!,
        html_url: getGitHubURLForRepo(owner, name)!,
      })
    }
  }

  const users: GitHubUser[] = [_member].filter(Boolean) // TODO
  const pages: GitHubPage[] = (_pages || []).filter(Boolean)

  const repo = repos.length === 1 ? repos[0] : undefined

  const commitShas = commits
    .filter(Boolean)
    .map((item: GitHubPushedCommit) => item.sha)
  const pageShas = pages.filter(Boolean).map((item: GitHubPage) => item.sha)
  const repoIds = repos.filter(Boolean).map((item: GitHubRepo) => item.id)
  const userIds = users.filter(Boolean).map((item: GitHubUser) => item.id)

  const repoFullName = repo && getRepoFullNameFromObject(repo)
  const forkRepoFullName = getRepoFullNameFromObject(forkee)

  const isPush = type === 'PushEvent'
  const isForcePush = isPush && (payload as GitHubPushEvent).forced
  const isPrivate = isEventPrivate(event)

  const canSee =
    !isPrivate ||
    !!(
      plan &&
      (plan.status === 'active' || plan.status === 'trialing') &&
      plan.featureFlags.enablePrivateRepositories
    )

  const isBot = getItemIsBot('activity', event)

  // GitHub returns the wrong avatar_url for app bots on actor.avatar_url,
  // but the correct avatar on payload.abc.user.avatar_url,
  // so lets get it from there instead
  const botAvatarURL = isBot
    ? getGitHubAvatarURLFromPayload(payload, actor.id)
    : undefined

  const avatarUrl = (isBot && botAvatarURL) || actor.avatar_url

  return {
    actor,
    avatarUrl,
    branchOrTagName,
    canSee,
    comment,
    commitShas,
    commits,
    createdAt,
    forkRepoFullName,
    forkee,
    id,
    isBot,
    isBranchMainEvent: isBranchMainEvent(event),
    isForcePush,
    isPrivate,
    isPush,
    isRead,
    isSaved,
    isTagMainEvent: isTagMainEvent(event),
    issueOrPullRequest,
    issueOrPullRequestNumber,
    mergedIds,
    pageShas,
    pages,
    release,
    repoFullName,
    repoIds,
    repos,
    userIds,
    users,
  }
}
