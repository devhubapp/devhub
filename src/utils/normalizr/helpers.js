import moment from 'moment'

import {
  getCommentIdFromUrl,
  getCommitShaFromUrl,
  getIssueOrPullRequestNumberFromUrl,
  getReleaseIdFromUrl,
  getRepoFullNameFromUrl,
  githubHTMLUrlFromAPIUrl,
} from '../helpers/github/url'

import { getIn } from '../immutable'
import type {
  GithubCommit,
  GithubIssue,
  GithubNotification,
  GithubPullRequest,
  GithubRelease,
} from '../types'

export function preferNewestMergeStrategy(entityA, entityB) {
  if (entityA.updated_at && entityB.updated_at) {
    const dateA = new Date(entityA.updated_at)
    const dateB = new Date(entityB.updated_at)

    return moment(dateB).isAfter(dateA)
      ? { ...entityA, ...entityB }
      : { ...entityB, ...entityA }
  }

  if (entityA.created_at && entityB.created_at) {
    const dateA = new Date(entityA.created_at)
    const dateB = new Date(entityB.created_at)

    return moment(dateB).isAfter(dateA)
      ? { ...entityA, ...entityB }
      : { ...entityB, ...entityA }
  }

  return {
    ...entityB,
    ...entityA,
  }
}

export function simpleIdAttribute(obj: { id: number | string }): string {
  const id = getIn(obj, ['id']) || ''
  return `${id}`.toLowerCase()
}

export function issueOrPullRequestIdAttribute(
  obj: GithubIssue | GithubPullRequest,
) {
  const url = getIn(obj, ['url']) || getIn(obj, ['repository_url'])
  const number =
    getIn(obj, ['number']) || getIssueOrPullRequestNumberFromUrl(url)

  const repoFullName = getRepoFullNameFromUrl(url).toLowerCase()
  return repoFullName && number
    ? `${repoFullName}#${number}`
    : simpleIdAttribute(obj)
}

export function commitIdAttribute(commit: GithubCommit) {
  const url = getIn(commit, ['url'])
  return (
    getIn(commit, ['sha']) ||
    getIn(commit, ['commit_id']) ||
    getCommitShaFromUrl(url) ||
    simpleIdAttribute(commit)
  )
}
export function releaseIdAttribute(release: GithubRelease) {
  const url = getIn(release, ['url'])
  return simpleIdAttribute(release) || getReleaseIdFromUrl(url)
}

export function notificationProcessStrategy(notification: GithubNotification) {
  if (!(notification && notification.subject)) return notification

  let newNotification = notification
  let number

  if (
    newNotification.subject.type === 'Issue' ||
    newNotification.subject.type === 'PullRequest'
  ) {
    number = getIssueOrPullRequestNumberFromUrl(newNotification.subject.url)

    const subject = {
      ...newNotification.subject,
      number,
    }

    newNotification = {
      ...newNotification,
      subject,
    }
  } else if (newNotification.subject.type === 'Commit') {
    const { title, ...commitSubject } = newNotification.subject

    const subject = {
      ...commitSubject,
      message: title,
      sha: getCommitShaFromUrl(newNotification.subject.url),
    }

    newNotification = {
      ...newNotification,
      subject,
    }
  } else if (newNotification.subject.type === 'Release') {
    const { title, ...releaseSubject } = newNotification.subject

    const subject = {
      ...releaseSubject,
      name: title,
    }

    newNotification = {
      ...newNotification,
      subject,
    }
  }

  // not really a comment link. why u do that github?
  if (
    newNotification.subject.url === newNotification.subject.latest_comment_url
  ) {
    delete newNotification.subject.latest_comment_url
  }

  if (newNotification.subject.latest_comment_url) {
    const id = getCommentIdFromUrl(newNotification.subject.latest_comment_url)

    if (id) {
      newNotification = {
        ...newNotification,
        comment: {
          id,
          html_url: githubHTMLUrlFromAPIUrl(
            newNotification.subject.latest_comment_url,
            { number },
          ),
          url: newNotification.subject.latest_comment_url,
        },
      }
    }
  }

  return newNotification
}
