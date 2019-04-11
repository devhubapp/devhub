import _ from 'lodash'
import moment from 'moment'

import {
  EnhancedGitHubEvent,
  GitHubEventAction,
  GitHubEventSubjectType,
  GitHubPullRequest,
  MultipleStarEvent,
} from '../../types'
import { getBranchNameFromRef, isPullRequest } from './shared'

export function getOlderEventDate(
  events: EnhancedGitHubEvent[],
  field: keyof EnhancedGitHubEvent = 'created_at',
) {
  const olderItem = sortEvents(events, field, 'desc').pop()
  return olderItem && olderItem[field]
}

export const eventActions: GitHubEventAction[] = [
  'added',
  'commented',
  'created',
  'deleted',
  'forked',
  'pushed',
  'released',
  'reviewed',
  'starred',
  'state_changed',
  'updated',
]

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
        includeBranch?: boolean
        includeFork?: boolean
        includeTag?: boolean
        issueOrPullRequestIsKnown?: boolean
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
    includeBranch,
    includeFork,
    includeTag,
    issueOrPullRequestIsKnown,
    repoIsKnown,
  } = options

  const isDraftPR =
    ('pull_request' in event.payload &&
      event.payload.pull_request &&
      event.payload.pull_request.draft) ||
    ('issue' in event.payload &&
      isPullRequest(event.payload.issue) &&
      (event.payload.issue as GitHubPullRequest).draft)

  const issueText = issueOrPullRequestIsKnown ? 'this issue' : 'an issue'
  const pullRequestText = issueOrPullRequestIsKnown
    ? `this ${isDraftPR ? 'draft pull request' : 'pull request'}`
    : `a ${isDraftPR ? 'draft pull request' : 'pull request'}`
  const repositoryText = repoIsKnown ? 'this repository' : 'a repository'

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
          actionText: `Commented on a commit${colonText}`,
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
            const branch = getBranchNameFromRef(event.payload.ref || undefined)
            return {
              action: 'created',
              actionText:
                includeBranch && branch
                  ? `Created the branch ${branch}`
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
                  ? `Created the tag ${tag}`
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
            const branch = getBranchNameFromRef(event.payload.ref)
            return {
              action: 'deleted',
              actionText:
                includeBranch && branch
                  ? `Deleted the branch ${branch}`
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
                  ? `Deleted the tag ${tag}`
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
        const forkFullName = fork && fork.full_name
        return {
          action: 'forked',
          actionText: includeFork
            ? `Forked ${repositoryText} to ${forkFullName}`
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
          case 'created':
            return {
              action: 'created',
              actionText: `Created ${pagesText}${colonText}`,
              subjectType: 'Wiki',
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
          subjectType: 'Issue',
        }
      }

      case 'IssuesEvent': {
        const subjectType: GitHubEventSubjectType = isPullRequest(event)
          ? 'PullRequest'
          : 'Issue'

        switch (event.payload.action) {
          case 'closed':
            return {
              action: 'state_changed',
              actionText: `Closed ${issueTextWithColon}`,
              subjectType,
            }
          case 'reopened':
            return {
              action: 'state_changed',
              actionText: `Reopened ${issueTextWithColon}`,
              subjectType,
            }
          case 'opened':
            return {
              action: 'created',
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
        return {
          action: 'added',
          actionText: `Added an user ${repositoryText &&
            `to ${repositoryTextWithColon}`}`,
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
              action: 'created',
              actionText: `Opened ${pullRequestTextWithColon}`,
              subjectType,
            }
          case 'edited':
            return {
              action: 'updated',
              actionText: `Edited ${pullRequestTextWithColon}`,
              subjectType,
            }

          case 'closed':
            return {
              action: 'state_changed',
              actionText: event.payload.pull_request.merged_at
                ? `Merged ${pullRequestTextWithColon}`
                : `Closed ${pullRequestTextWithColon}`,
              subjectType,
            }

          case 'reopened':
            return {
              action: 'state_changed',
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
              subjectType: 'Release',
            }
          case 'edited':
            return {
              action: 'updated',
              actionText: `Edited ${pullRequestText} review${colonText}`,
              subjectType: 'Release',
            }
          case 'deleted':
            return {
              action: 'deleted',
              actionText: `Deleted ${pullRequestText} review${colonText}`,
              subjectType: 'Release',
            }
          default: {
            console.error(
              'Unknown PullRequestReviewCommentEvent action',
              event.payload.action,
            )
            return {
              action: 'reviewed',
              actionText: `Updated ${pullRequestText} review${colonText}`,
              subjectType: 'Release',
            }
          }
        }
      }

      case 'PushEvent': {
        const commits = event.payload.commits || [{}]
        // const commit = event.payload.head_commit || commits[0];
        const count =
          Math.max(
            ...[
              1,
              event.payload.size,
              event.payload.distinct_size,
              commits.length,
            ],
          ) || 1

        const branch = getBranchNameFromRef(event.payload.ref)
        const pushedText = event.forced ? 'Force pushed' : 'Pushed'
        const commitText = count > 1 ? ` ${count} commits` : ' a commit'
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

  return enhancedEvents.length === events.length ? events : enhancedEvents
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
) {
  if (!events) return []
  return _(events)
    .uniqBy('id')
    .orderBy(field, order)
    .value()
}
