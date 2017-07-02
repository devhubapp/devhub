// @flow
/* eslint-disable import/prefer-default-export */

import moment from 'moment'
import { max } from 'lodash'
import { fromJS, List, Map, Set } from 'immutable'

import { get, getIn } from '../../immutable'
import { isArchivedFilter, isReadFilter } from '../../../selectors'
import {
  getIssueIconAndColor,
  getPullRequestIconAndColor,
  isPullRequest,
} from './shared'
import * as baseTheme from '../../../styles/themes/base'

import type {
  GithubEvent,
  GithubEventType,
  GithubIcon,
  ThemeObject,
} from '../../types'

export function getEventIconAndColor(
  event: GithubEvent,
  theme?: ThemeObject = baseTheme,
): { icon: GithubIcon, color?: string } {
  const eventType = get(event, 'type').split(':')[0]
  const payload = get(event, 'payload')

  switch (eventType) {
    case 'CommitCommentEvent':
      return { icon: 'git-commit', subIcon: 'comment-discussion' }
    case 'CreateEvent':
      switch (get(payload, 'ref_type')) {
        case 'repository':
          return { icon: 'repo' }
        case 'branch':
          return { icon: 'git-branch' }
        case 'tag':
          return { icon: 'tag' }
        default:
          return { icon: 'plus' }
      }
    case 'DeleteEvent':
      switch (get(payload, 'ref_type')) {
        case 'repository':
          return { icon: 'repo', color: theme.red }
        case 'branch':
          return { icon: 'git-branch', color: theme.red }
        case 'tag':
          return { icon: 'tag', color: theme.red }
        default:
          return { icon: 'trashcan' }
      }
    case 'GollumEvent':
      return { icon: 'book' }
    case 'ForkEvent':
      return { icon: 'repo-forked' }

    case 'IssueCommentEvent':
      return {
        ...(get(payload, 'pull_request') || isPullRequest(get(payload, 'issue'))
          ? getPullRequestIconAndColor(
              get(payload, 'pull_request') || get(payload, 'issue'),
              theme,
            )
          : getIssueIconAndColor(get(payload, 'issue'), theme)),
        subIcon: 'comment-discussion',
      }

    case 'IssuesEvent':
      return (() => {
        const issue = get(payload, 'issue')

        switch (get(payload, 'action')) {
          case 'opened':
            return getIssueIconAndColor(Map({ state: 'open' }), theme)
          case 'closed':
            return getIssueIconAndColor(Map({ state: 'closed' }), theme)

          case 'reopened':
            return {
              ...getIssueIconAndColor(Map({ state: 'open' }), theme),
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
            return getIssueIconAndColor(issue, theme)
        }
      })()
    case 'MemberEvent':
      return { icon: 'person' }
    case 'PublicEvent':
      return { icon: 'globe', color: theme.blue }

    case 'PullRequestEvent':
      return (() => {
        const pullRequest = get(payload, 'pull_request')

        switch (get(payload, 'action')) {
          case 'opened':
          case 'reopened':
            return getPullRequestIconAndColor(Map({ state: 'open' }), theme)
          // case 'closed': return getPullRequestIconAndColor(Map({ state: 'closed' }), theme);

          // case 'assigned':
          // case 'unassigned':
          // case 'labeled':
          // case 'unlabeled':
          // case 'edited':
          default:
            return getPullRequestIconAndColor(pullRequest, theme)
        }
      })()

    case 'PullRequestReviewEvent':
    case 'PullRequestReviewCommentEvent':
      return {
        ...getPullRequestIconAndColor(get(payload, 'pull_request'), theme),
        subIcon: 'comment-discussion',
      }

    case 'PushEvent':
      return { icon: 'code' }
    case 'ReleaseEvent':
      return { icon: 'tag' }
    case 'WatchEvent':
      return { icon: 'star', color: theme.star }
    default:
      return { icon: 'mark-github' }
  }
}

type GetEventTextOptions = {
  issueOrPullRequestIsKnown: ?boolean,
  repoIsKnown: ?boolean,
}
export function getEventText(
  event: GithubEvent,
  options: ?GetEventTextOptions,
): string {
  const eventType = get(event, 'type')
  const payload = get(event, 'payload')

  const { issueOrPullRequestIsKnown, repoIsKnown } = options || {}

  const issueText = issueOrPullRequestIsKnown ? 'this issue' : 'an issue'
  const pullRequestText = issueOrPullRequestIsKnown ? 'this pr' : 'a pr'
  const repositoryText = repoIsKnown ? 'this repository' : 'a repository'

  const text = (() => {
    switch (eventType) {
      case 'CommitCommentEvent':
        return 'commented on a commit'
      case 'CreateEvent':
        switch (get(payload, 'ref_type')) {
          case 'repository':
            return `created ${repositoryText}`
          case 'branch':
            return 'created a branch'
          case 'tag':
            return 'created a tag'
          default:
            return 'created something'
        }
      case 'DeleteEvent':
        switch (get(payload, 'ref_type')) {
          case 'repository':
            return `deleted ${repositoryText}`
          case 'branch':
            return 'deleted a branch'
          case 'tag':
            return 'deleted a tag'
          default:
            return 'deleted something'
        }
      case 'GollumEvent':
        return (() => {
          const count = (get(payload, 'pages') || List([])).size || 1
          const pagesText = count > 1 ? `${count} wiki pages` : 'a wiki page'
          switch (get(
            (get(payload, 'pages') || List([]))[0] || Map(),
            'action',
          )) {
            case 'created':
              return `created ${pagesText}`
            default:
              return `updated ${pagesText}`
          }
        })()
      case 'ForkEvent':
        return `forked ${repositoryText}`
      case 'IssueCommentEvent':
        return `commented on ${isPullRequest(get(payload, 'issue'))
          ? pullRequestText
          : issueText}`
      case 'IssuesEvent': // TODO: Fix these texts
        switch (get(payload, 'action')) {
          case 'closed':
            return `closed ${issueText}`
          case 'reopened':
            return `reopened ${issueText}`
          case 'opened':
            return `opened ${issueText}`
          case 'assigned':
            return `assigned ${issueText}`
          case 'unassigned':
            return `unassigned ${issueText}`
          case 'labeled':
            return `labeled ${issueText}`
          case 'unlabeled':
            return `unlabeled ${issueText}`
          case 'edited':
            return `edited ${issueText}`
          case 'milestoned':
            return `milestoned ${issueText}`
          case 'demilestoned':
            return `demilestoned ${issueText}`
          default:
            return `interacted with ${issueText}`
        }
      case 'MemberEvent':
        return `added an user ${repositoryText && `to ${repositoryText}`}`
      case 'PublicEvent':
        return `made ${repositoryText} public`
      case 'PullRequestEvent':
        switch (get(payload, 'action')) {
          case 'assigned':
            return `assigned ${pullRequestText}`
          case 'unassigned':
            return `unassigned ${pullRequestText}`
          case 'labeled':
            return `labeled ${pullRequestText}`
          case 'unlabeled':
            return `unlabeled ${pullRequestText}`
          case 'opened':
            return `opened ${pullRequestText}`
          case 'edited':
            return `edited ${pullRequestText}`

          case 'closed':
            return getIn(payload, ['pull_request', 'merged_at'])
              ? `merged ${pullRequestText}`
              : `closed ${pullRequestText}`

          case 'reopened':
            return `reopened ${pullRequestText}`
          default:
            return `interacted with ${pullRequestText}`
        }
      case 'PullRequestReviewEvent':
        return `reviewed ${pullRequestText}`
      case 'PullRequestReviewCommentEvent':
        switch (get(payload, 'action')) {
          case 'created':
            return `commented on ${pullRequestText} review`
          case 'edited':
            return `edited ${pullRequestText} review`
          case 'deleted':
            return `deleted ${pullRequestText} review`
          default:
            return `interacted with ${pullRequestText} review`
        }
      case 'PushEvent':
        return (() => {
          const commits = get(payload, 'commits') || List([Map()])
          // const commit = get(payload, 'head_commit') || commits[0];
          const count =
            max([
              1,
              get(payload, 'size'),
              get(payload, 'distinct_size'),
              commits.size,
            ]) || 1
          const branch = (get(payload, 'ref') || '').split('/').pop()

          const pushedText = get(payload, 'forced') ? 'force pushed' : 'pushed'
          const commitText = count > 1 ? `${count} commits` : 'a commit'
          const branchText = branch === 'master' ? `to ${branch}` : ''

          return `${pushedText} ${commitText} ${branchText}`
        })()
      case 'ReleaseEvent':
        return 'published a release'
      case 'WatchEvent':
        return `starred ${repositoryText}`
      case 'WatchEvent:OneRepoMultipleUsers':
        return (() => {
          const otherUsers = get(payload, 'users')
          const otherUsersText =
            otherUsers && otherUsers.size > 0
              ? otherUsers.size > 1
                ? `and ${otherUsers.size} others`
                : 'and 1 other'
              : ''

          return `${otherUsersText} starred ${repositoryText}`
        })()
      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          const otherRepos = get(payload, 'repos')
          const count = (otherRepos && otherRepos.size) || 0

          return count > 1
            ? `starred ${count} repositories`
            : `starred ${repositoryText}`
        })()
      default:
        return 'did something'
    }
  })()

  return text.replace(/ {2}/g, ' ').trim()
}

export function groupSimilarEvents(events: Array<GithubEvent>) {
  let hasMerged = false

  const tryGroupEvents = (eventA: GithubEvent, eventB: GithubEvent) => {
    if (!eventA || !eventB) return null

    const typeA: GithubEventType = get(eventA, 'type')
    const typeB: GithubEventType = get(eventB, 'type')

    const isSameRepo =
      getIn(eventA, ['repo', 'id']) === getIn(eventB, ['repo', 'id'])
    const isSameUser =
      getIn(eventA, ['actor', 'id']) === getIn(eventB, ['actor', 'id'])
    const isSameArchiveStatus =
      isArchivedFilter(eventA) === isArchivedFilter(eventB)
    const isSameReadStatus = isReadFilter(eventA) === isReadFilter(eventB)
    const createdAtMinutesDiff = moment(get(eventA, 'created_at')).diff(
      moment(get(eventB, 'created_at')),
      'minutes',
    )
    const merged = get(eventA, 'merged') || List()

    // only merge events with same archive and read status
    if (!(isSameArchiveStatus && isSameReadStatus)) return null

    // only merge events that were created in the same hour
    if (createdAtMinutesDiff >= 24 * 60) return null

    // only merge 5 items max
    if (merged.size >= 5 - 1) return null

    switch (typeA) {
      case 'WatchEvent':
        return (() => {
          switch (typeB) {
            case 'WatchEvent':
              return (() => {
                if (isSameRepo) {
                  return eventA.mergeDeep(
                    fromJS({
                      type: 'WatchEvent:OneRepoMultipleUsers',
                      payload: {
                        users: [get(eventB, 'actor')],
                      },
                    }),
                  )
                } else if (isSameUser) {
                  return eventA.mergeDeep(
                    fromJS({
                      type: 'WatchEvent:OneUserMultipleRepos',
                      repo: null,
                      payload: {
                        repos: [get(eventA, 'repo'), get(eventB, 'repo')],
                      },
                    }),
                  )
                }

                return null
              })()

            default:
              return null
          }
        })()

      case 'WatchEvent:OneRepoMultipleUsers':
        return (() => {
          switch (typeB) {
            case 'WatchEvent':
              return (() => {
                if (isSameRepo) {
                  const users = getIn(eventA, ['payload', 'users']) || List()
                  const newUser = getIn(eventB, ['actor'])

                  const alreadyMergedThisUser = users.find(
                    mergedUser =>
                      `${get(mergedUser, 'id')}` === `${get(newUser, 'id')}`,
                  )

                  if (!alreadyMergedThisUser) {
                    const newUsers = users.push(newUser)
                    return eventA.setIn(['payload', 'users'], newUsers)
                  }

                  return null
                }

                return null
              })()

            default:
              return null
          }
        })()

      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          switch (typeB) {
            case 'WatchEvent':
              return (() => {
                if (isSameUser) {
                  const repos = getIn(eventA, ['payload', 'repos']) || List()
                  const newRepo = getIn(eventB, ['repo'])

                  const alreadyMergedThisRepo = repos.find(
                    mergedRepo =>
                      `${get(mergedRepo, 'id')}` === `${get(newRepo, 'id')}`,
                  )

                  if (!alreadyMergedThisRepo) {
                    const newRepos = repos.push(newRepo)
                    return eventA.setIn(['payload', 'repos'], newRepos)
                  }

                  return null
                }

                return null
              })()

            default:
              return null
          }
        })()

      default:
        return null
    }
  }

  const accumulator = (newEvents: Array<GithubEvent>, event: GithubEvent) => {
    const lastEvent = newEvents.last()
    const mergedLastEvent = tryGroupEvents(lastEvent, event)

    if (mergedLastEvent) {
      hasMerged = true

      let allMergedEvents = get(mergedLastEvent, 'merged') || List()
      allMergedEvents = allMergedEvents.push(event)

      const mergedLastEventUpdated = mergedLastEvent.set(
        'merged',
        allMergedEvents,
      )
      return newEvents.set(-1, mergedLastEventUpdated)
    }

    return newEvents.push(event)
  }

  const newEvents = events.reduce(accumulator, List())
  return hasMerged ? newEvents : events
}

export function getEventIdsFromEventIncludingMerged(event) {
  if (!event) return Set([])

  let eventIds = Set([get(event, 'id')])
  const merged = get(event, 'merged')

  if (merged) {
    merged.forEach(mergedEvent => {
      eventIds = eventIds.add(get(mergedEvent, 'id'))
    })
  }

  return eventIds.toList()
}

export function getEventIdsFromEventsIncludingMerged(events) {
  let eventIds = Set([])
  if (!events) return eventIds

  events.forEach(event => {
    eventIds = eventIds.concat(getEventIdsFromEventIncludingMerged(event))
  })

  return eventIds.toList()
}
