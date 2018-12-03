import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import {
  Column,
  ColumnSubscription,
  EnhancedGitHubNotification,
  GitHubComment,
  GitHubCommit,
  GitHubIssue,
  GitHubNotification,
  GitHubPullRequest,
  GitHubRelease,
  LoadState,
  NotificationSubscription,
  Omit,
} from '@devhub/core/src/types'
import { getOwnerAndRepo } from '@devhub/core/src/utils/helpers/github/shared'
import {
  getCommentIdFromUrl,
  getCommitShaFromUrl,
  getIssueOrPullRequestNumberFromUrl,
  getReleaseIdFromUrl,
} from '@devhub/core/src/utils/helpers/github/url'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications, octokit } from '../libs/github'
import { getFilteredNotifications } from '../utils/helpers/filters'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'notifications' | 'fetchNextPage' | 'loadState'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { column, subscriptions } = props

    const enhancedCommitShasRef = useRef(new Map())
    const enhancedCommentIdsRef = useRef(new Map())
    const enhancedIssueOrPullRequestIdsRef = useRef(new Map())
    const enhancedReleaseIdsRef = useRef(new Map())

    const [hasFetched, setHasFetched] = useState(false)
    const [canFetchMore, setCanFetchMore] = useState(false)
    const [notifications, setNotifications] = useState<GitHubNotification[]>([])
    const [filteredNotifications, setFilteredNotifications] = useState<
      GitHubNotification[]
    >([])
    const [enhancedNotifications, setEnhancedNotifications] = useState<
      EnhancedGitHubNotification[]
    >([])
    const [olderNotificationDate, setOlderNotificationDate] = useState<
      string | undefined
    >(undefined)
    const [loadState, setLoadState] = useState<LoadState>('loading_first')
    const [pagination, setPagination] = useState({ page: 1, perPage: 10 })

    useEffect(() => {
      fetchData()
    }, [])

    useEffect(() => {
      const timer = setInterval(fetchData, 1000 * 60)
      return () => clearInterval(timer)
    })

    useEffect(
      () => {
        const promises = notifications.map(async notification => {
          if (!(notification.repository && notification.repository.full_name))
            return

          const { owner, repo } = getOwnerAndRepo(
            notification.repository.full_name,
          )
          if (!(owner && repo)) return

          const commentId = getCommentIdFromUrl(
            notification.subject.latest_comment_url,
          )

          const enhance = {} as {
            comment?: GitHubComment
            commit?: GitHubCommit
            issue?: GitHubIssue
            pullRequest?: GitHubPullRequest
            release?: GitHubRelease
          }

          switch (notification.subject.type) {
            case 'Commit': {
              const sha = getCommitShaFromUrl(notification.subject.url)
              if (!sha) break

              if (!enhancedCommitShasRef.current.has(sha)) {
                try {
                  enhancedCommitShasRef.current.set(sha, null)

                  const { data } = await octokit.repos.getCommit({
                    owner,
                    repo,
                    sha,
                  })

                  if (!(data && data.sha)) throw new Error('Invalid response')

                  enhance.commit = (data as any) as GitHubCommit
                  enhancedCommitShasRef.current.set(sha, true)
                } catch (error) {
                  console.error(
                    'Failed to load Commit notification details',
                    error,
                  )
                  enhancedCommitShasRef.current.set(sha, false)
                  break
                }
              }

              if (commentId && !enhancedCommentIdsRef.current.has(commentId)) {
                try {
                  const { data } = await octokit.repos.getCommitComment({
                    owner,
                    repo,
                    comment_id: commentId,
                  })

                  if (!(data && data.id)) throw new Error('Invalid response')

                  enhance.comment = (data as any) as GitHubComment
                  enhancedCommentIdsRef.current.set(commentId, true)
                } catch (error) {
                  console.error(
                    'Failed to load Commit Comment notification details',
                    error,
                  )
                  enhancedCommentIdsRef.current.set(commentId, false)
                }
              }

              break
            }

            case 'Issue':
            case 'PullRequest': {
              const issueOrPullRequestNumber = getIssueOrPullRequestNumberFromUrl(
                notification.subject.url,
              )
              if (!issueOrPullRequestNumber) break

              const fakeId = `${owner}/${repo}#${issueOrPullRequestNumber}`

              if (!enhancedIssueOrPullRequestIdsRef.current.has(fakeId)) {
                try {
                  enhancedIssueOrPullRequestIdsRef.current.set(fakeId, null)

                  if (notification.subject.type === 'PullRequest') {
                    const { data } = await octokit.pulls.get({
                      owner,
                      repo,
                      number: issueOrPullRequestNumber,
                    })

                    if (!(data && data.id)) throw new Error('Invalid response')

                    enhance.pullRequest = (data as any) as GitHubPullRequest
                  } else {
                    const { data } = await octokit.issues.get({
                      owner,
                      repo,
                      number: issueOrPullRequestNumber,
                    })

                    if (!(data && data.id)) throw new Error('Invalid response')

                    enhance.issue = (data as any) as GitHubIssue
                  }
                  enhancedIssueOrPullRequestIdsRef.current.set(fakeId, true)
                } catch (error) {
                  console.error(
                    `Failed to load ${
                      notification.subject.type
                    } notification details`,
                    error,
                  )
                  enhancedIssueOrPullRequestIdsRef.current.set(fakeId, false)
                  break
                }
              }

              if (commentId && !enhancedCommentIdsRef.current.has(commentId)) {
                try {
                  enhancedCommentIdsRef.current.set(commentId, null)

                  if (
                    notification.subject.latest_comment_url.includes('pulls')
                  ) {
                    const { data } = await octokit.pulls.getComment({
                      owner,
                      repo,
                      comment_id: commentId,
                    })

                    if (!(data && data.id)) throw new Error('Invalid response')

                    enhance.comment = (data as any) as GitHubComment
                  } else {
                    const { data } = await octokit.issues.getComment({
                      owner,
                      repo,
                      comment_id: commentId,
                    })

                    if (!(data && data.id)) throw new Error('Invalid response')

                    enhance.comment = (data as any) as GitHubComment
                  }

                  enhancedCommentIdsRef.current.set(commentId, true)
                } catch (error) {
                  console.error(
                    'Failed to load Comment notification details',
                    error,
                  )
                  enhancedCommentIdsRef.current.set(commentId, false)
                }
              }

              break
            }

            case 'Release': {
              const releaseId = getReleaseIdFromUrl(notification.subject.url)
              if (!releaseId) break

              if (!enhancedReleaseIdsRef.current.has(releaseId)) {
                try {
                  enhancedReleaseIdsRef.current.set(releaseId, null)

                  const { data } = await octokit.repos.getRelease({
                    owner,
                    repo,
                    release_id: parseInt(releaseId, 10),
                  })

                  if (!(data && data.id)) throw new Error('Invalid response')

                  enhance.release = (data as any) as GitHubRelease

                  enhancedReleaseIdsRef.current.set(releaseId, true)
                } catch (error) {
                  console.error(
                    'Failed to load Release notification details',
                    error,
                  )
                  enhancedReleaseIdsRef.current.set(releaseId, false)
                  break
                }
              }

              break
            }

            default:
              break
          }

          if (!Object.keys(enhance).length) return

          return { notificationId: notification.id, enhance }
        })

        Promise.all(promises).then(enhancements => {
          const enhancementMap: any = enhancements.reduce(
            (map, payload) =>
              payload
                ? {
                    ...map,
                    [payload.notificationId]: payload.enhance,
                  }
                : map,
            {},
          )

          setEnhancedNotifications(currentEnhancedNotifications =>
            notifications.map(cen => {
              const enhanced = currentEnhancedNotifications.find(
                n => n.id === cen.id,
              )

              const enhance = enhancementMap[cen.id]
              if (!enhance) {
                if (!enhanced) return cen
                return { ...enhanced, ...cen }
              }

              return {
                ...enhanced,
                ...cen,
                ...enhance,
              } as EnhancedGitHubNotification
            }),
          )
        })
      },
      [notifications],
    )

    useEffect(
      () => {
        if (!hasFetched) return
        setLoadState('loaded')
      },
      [enhancedNotifications],
    )

    useEffect(
      () => {
        setFilteredNotifications(
          getFilteredNotifications(enhancedNotifications, column.filters),
        )
      },
      [enhancedNotifications, column.filters],
    )

    useEffect(
      () => {
        const clearedAt = column.filters && column.filters.clearedAt
        const olderDate = getOlderNotificationDate(notifications)

        setCanFetchMore(!clearedAt || !olderDate || clearedAt < olderDate)
      },
      [column.filters && column.filters.clearedAt],
    )

    const fetchData = async ({
      page: _page,
      perPage: _perPage,
    }: { page?: number; perPage?: number } = {}) => {
      const {
        id: subscriptionId,
        params: _params,
      } = subscriptions[0] as NotificationSubscription

      const page = Math.max(1, _page || 1)
      const perPage = Math.min(_perPage || pagination.perPage || 10, 50)

      try {
        setLoadState(prevLoadState =>
          page > 1
            ? 'loading_more'
            : !prevLoadState ||
              prevLoadState === 'not_loaded' ||
              prevLoadState === 'loading_first'
            ? 'loading_first'
            : 'loading',
        )

        const params = { ..._params, page, per_page: perPage }
        const response = await getNotifications(params, {
          subscriptionId,
        })

        if (!hasFetched) setHasFetched(true)

        if (Array.isArray(response.data) && response.data.length) {
          const olderDateFromThisResponse = getOlderNotificationDate(
            response.data,
          )

          setNotifications(prevNotifications =>
            _.uniqBy(_.concat(response.data, prevNotifications), 'id'),
          )
          setPagination(prevPagination => ({ ...prevPagination, page }))
          // setLoadState('loaded') // moved to the enchancement effect

          if (
            !olderNotificationDate ||
            (olderDateFromThisResponse &&
              olderDateFromThisResponse <= olderNotificationDate)
          ) {
            setOlderNotificationDate(olderDateFromThisResponse)

            if (response.data.length >= perPage) {
              const clearedAt = column.filters && column.filters.clearedAt
              if (clearedAt && clearedAt >= olderDateFromThisResponse) {
                setCanFetchMore(false)
              } else {
                setCanFetchMore(true)
              }
            } else {
              setCanFetchMore(false)
            }
          }
        } else {
          setLoadState('loaded')
          setPagination(prevPagination => ({ ...prevPagination, page }))
          setCanFetchMore(false)
        }
      } catch (error) {
        console.error('Failed to load GitHub notifications', error)
        setLoadState('loaded')
      }
    }

    const fetchNextPage = ({ perPage }: { perPage?: number } = {}) => {
      const nextPage = (pagination.page || 1) + 1
      fetchData({ page: nextPage, perPage })
    }

    return (
      <NotificationCards
        {...props}
        key={`notification-cards-${column.id}`}
        notifications={filteredNotifications}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        loadState={loadState}
      />
    )
  },
)

function getOlderNotificationDate(notifications: GitHubNotification[]) {
  const olderItem = _.orderBy(notifications, 'updated_at', 'asc')[0]
  return olderItem && olderItem.updated_at
}
