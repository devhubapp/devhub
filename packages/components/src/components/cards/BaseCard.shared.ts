import { PixelRatio } from 'react-native'

import {
  Column,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  getBaseUrlFromOtherUrl,
  getCommitCompareUrlFromRefs,
  getCommitCompareUrlFromUrls,
  getCommitUrlFromOtherUrl,
  getEventIconAndColor,
  getEventMetadata,
  getGitHubEventSubItems,
  getGitHubNotificationSubItems,
  getGitHubSearchURL,
  getIssueOrPullRequestIconAndColor,
  getIssueOrPullRequestSubjectType,
  getItemSubjectType,
  getNotificationIconAndColor,
  getOwnerAndRepo,
  getRepoFullNameFromUrl,
  getRepoUrlFromOtherUrl,
  getUserAvatarByEmail,
  getUserAvatarFromObject,
  getUserURLFromObject,
  GitHubIcon,
  GitHubPushEvent,
  isIssueOrPullRequestPrivate,
  isItemRead,
  stripMarkdown,
  ThemeColors,
  trimNewLinesAndSpaces,
  tryGetUsernameFromGitHubEmail,
} from '@devhub/core'
import {
  avatarSize,
  contentPadding,
  normalTextSize,
  smallAvatarSize,
  smallerTextSize,
  smallTextSize,
} from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import { cardItemSeparatorSize } from './partials/CardItemSeparator'

const _iconContainerSize = 19
const _actionFontSize = smallerTextSize
const _subitemFontSize = smallTextSize
const _subitemLineHeight = _subitemFontSize + 2
export const sizes = {
  cardPadding: contentPadding * (2 / 3),
  iconContainerSize: _iconContainerSize,
  avatarContainerWidth: PixelRatio.roundToNearestPixel(
    avatarSize + _iconContainerSize / 2,
  ),
  avatarContainerHeight: PixelRatio.roundToNearestPixel(
    avatarSize + _iconContainerSize / 4,
  ),
  actionContainerHeight: Math.max(_actionFontSize, smallAvatarSize),
  actionFontSize: _actionFontSize,
  subitemContainerHeight: Math.max(_subitemLineHeight, smallAvatarSize),
  subitemFontSize: _subitemFontSize,
  subitemLineHeight: _subitemLineHeight,
  githubAppMessageContainerHeight: Math.max(
    _subitemLineHeight,
    smallAvatarSize,
  ),
  horizontalSpaceSize: contentPadding / 2,
  rightInnerTopSpacing: 0,
  rightTextLineHeight: normalTextSize + 6,
  verticalSpaceSize: contentPadding / 2,
}

export interface BaseCardProps {
  action?: {
    avatar: {
      imageURL: string
      linkURL: string
    }
    text: string
  }
  avatar: {
    imageURL: string
    linkURL: string
  }
  date: string
  githubApp?: {
    ownerId?: number | string | undefined
    repoId?: number | string | undefined
    text?: string
  }
  height: number
  icon: {
    name: GitHubIcon
    color?: keyof ThemeColors
  }
  id: string | number
  isPrivate: boolean
  isRead: boolean
  link: string
  subitems?: Array<{
    avatar:
      | {
          imageURL: string
          linkURL: string
        }
      | undefined
    text: string
  }>
  subtitle?: string
  text?: string
  title: string
  type: Column['type']
}

function getRepoText({
  branchOrTagName,
  issueOrPullRequestNumber,
  ownerIsKnown,
  repoFullName,
  repoIsKnown,
}: {
  branchOrTagName?: string | undefined
  issueOrPullRequestNumber: number | undefined
  ownerIsKnown: boolean
  repoFullName: string | undefined
  repoIsKnown: boolean
}) {
  const repoNameOrFullName =
    (ownerIsKnown && getOwnerAndRepo(repoFullName).repo) || repoFullName

  if (repoIsKnown && issueOrPullRequestNumber)
    return `#${issueOrPullRequestNumber || ''}`

  if (repoNameOrFullName && issueOrPullRequestNumber)
    return `${repoNameOrFullName}#${issueOrPullRequestNumber}`

  if (repoNameOrFullName && branchOrTagName)
    return `${repoNameOrFullName}#${branchOrTagName}`

  return repoNameOrFullName
}

function _getCardPropsForItem(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
  {
    ownerIsKnown,
    repoIsKnown,
  }: { ownerIsKnown: boolean; repoIsKnown: boolean },
): Omit<BaseCardProps, 'height'> {
  const id = item.id

  switch (type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent

      const {
        actor,
        branchOrTagName,
        comment: _comment,
        commits,
        forkee,
        isBranchMainEvent,
        isPrivate,
        isRead,
        isTagMainEvent,
        issueOrPullRequest,
        release,
        repoFullName,
        repos,
        users,
      } = getGitHubEventSubItems(event)

      const date = event.created_at

      const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
        repoFullName || '',
      )

      const isStarOrFork =
        event.type === 'WatchEvent' || event.type === 'ForkEvent'

      const renderRepoName =
        !repoIsKnown &&
        repos.length === 1 &&
        !issueOrPullRequest &&
        (!ownerIsKnown || !isStarOrFork)

      const actionTextOptions: Parameters<typeof getEventMetadata>[1] = {
        appendColon: false,
        includeBranch: false,
        includeFork: false,
        includeRepo: !renderRepoName,
        includeTag: false,
        includeUser: true,
        repoIsKnown: repoIsKnown || renderRepoName,
        ownerIsKnown,
      }

      const { actionText: _actionText, action: actionType } = getEventMetadata(
        event,
        actionTextOptions,
      )
      const actionText = `${_actionText
        .substr(0, 1)
        .toLowerCase()}${_actionText.substr(1)}`

      const iconDetails = getEventIconAndColor(event)
      const icon = { name: iconDetails.icon, color: iconDetails.color }

      const repoURL = fixURL(
        repos[0].html_url || getRepoUrlFromOtherUrl(repos[0].url),
      )!
      const repoImageURL =
        (repos[0].owner && getUserAvatarFromObject(repos[0].owner)) ||
        (repoURL &&
          `${getBaseUrlFromOtherUrl(repoURL)}/${repoOwnerName}.png`) ||
        ''

      const forkURL = fixURL(
        forkee && (forkee.html_url || getRepoUrlFromOtherUrl(forkee.url)),
      )

      const actorAvatar: BaseCardProps['avatar'] = {
        imageURL: getUserAvatarFromObject(actor)!,
        linkURL: getUserURLFromObject(actor)!,
      }

      const repoAvatar: BaseCardProps['avatar'] = {
        imageURL: repoImageURL,
        linkURL: repoURL,
      }

      const subjectType = getItemSubjectType('activity', event)

      const subitems =
        _comment && _comment.body
          ? ((): BaseCardProps['subitems'] | undefined => {
              const trimmerBody = trimNewLinesAndSpaces(
                stripMarkdown(_comment.body),
                120,
              )
              if (!trimmerBody) return undefined

              return [
                {
                  avatar: {
                    imageURL: getUserAvatarFromObject(_comment.user)!,
                    linkURL: getUserURLFromObject(_comment.user)!,
                  },
                  text: trimmerBody,
                },
              ]
            })()
          : undefined

      const actorUsername = actor.display_login || actor.login

      const actorAction: BaseCardProps['action'] = {
        avatar: actorAvatar,
        text: `${actorUsername} ${actionText}`,
      }
      const actorActionOrUndefined =
        _comment &&
        _comment.body &&
        subitems &&
        subitems &&
        (actionType === 'commented' || actionType === 'reviewed') &&
        (subjectType === 'Commit' ? !!commits[0] : true)
          ? undefined
          : actorAction

      switch (event.type) {
        case 'ForkEvent':
        case 'WatchEvent': {
          return ownerIsKnown || repoIsKnown
            ? {
                action: undefined,
                avatar: actorAvatar,
                date,
                icon,
                id,
                isPrivate,
                isRead,
                link:
                  event.type === 'WatchEvent' && actorAvatar.linkURL
                    ? repoIsKnown
                      ? actorAvatar.linkURL
                      : `${actorAvatar.linkURL}?tab=stars&q=${repoFullName}`
                    : forkURL || repoURL,
                subitems: undefined,
                subtitle: undefined,
                text: actionText,
                title: actorUsername,
                type,
              }
            : {
                action: actorAction,
                avatar: repoAvatar,
                date,
                icon,
                id,
                isPrivate,
                isRead,
                link: forkURL || repoURL,
                subitems: undefined,
                subtitle: undefined,
                text: repoOwnerName,
                title: repoName!,
                type,
              }
        }

        default: {
          if (issueOrPullRequest) {
            return {
              action: actorActionOrUndefined,
              avatar: ownerIsKnown
                ? {
                    imageURL: getUserAvatarFromObject(issueOrPullRequest.user)!,
                    linkURL: getUserURLFromObject(issueOrPullRequest.user)!,
                  }
                : repoAvatar,
              date,
              icon,
              id,
              isPrivate,
              isRead,
              link:
                (_comment && (_comment.html_url || fixURL(_comment.url))) ||
                issueOrPullRequest.html_url ||
                fixURL(issueOrPullRequest.url)!,
              subitems,
              subtitle: undefined,
              text: getRepoText({
                repoFullName,
                ownerIsKnown,
                repoIsKnown,
                issueOrPullRequestNumber: issueOrPullRequest.number,
              }),
              title: issueOrPullRequest.title,
              type,
            }
          }

          if (commits && commits.length === 1) {
            const commit = commits[0]

            return {
              action: actorActionOrUndefined,
              avatar: {
                imageURL: getUserAvatarByEmail(commit.author.email, {
                  baseURL: getBaseUrlFromOtherUrl(commit.url),
                }),
                linkURL: commit.author.email
                  ? getGitHubSearchURL({
                      q: commit.author.email,
                      type: 'Users',
                    })
                  : '',
              },
              date,
              icon,
              id,
              isPrivate,
              isRead,
              link:
                (_comment && _comment.html_url) ||
                getCommitUrlFromOtherUrl(commit.url)!,
              subitems,
              subtitle: undefined,
              text: repoIsKnown
                ? tryGetUsernameFromGitHubEmail(commit.author.email) ||
                  (commit.author.name && commit.author.email
                    ? `${commit.author.name} <${commit.author.email}>`
                    : commit.author.name || commit.author.email)
                : getRepoText({
                    branchOrTagName,
                    repoFullName,
                    ownerIsKnown,
                    repoIsKnown,
                    issueOrPullRequestNumber: undefined,
                  }),
              title: commit.message,
              type,
            }
          }

          if (commits && commits.length > 1) {
            const _event = event as GitHubPushEvent

            const total = Math.max(
              commits.length || 1,
              _event.payload.distinct_size || 1,
              _event.payload.size || 1,
            )

            const maxSize = 5
            const sliceSize = commits.length > maxSize ? maxSize - 1 : maxSize
            const hasMoreCount = Math.max(0, total - sliceSize)

            return {
              action: actorActionOrUndefined,
              avatar: repoAvatar,
              date,
              icon,
              id,
              isPrivate,
              isRead,
              link:
                _event.payload.before && _event.payload.head
                  ? getCommitCompareUrlFromRefs(
                      _event.payload.before,
                      _event.payload.head,
                      { repoURL },
                    )!
                  : getCommitCompareUrlFromUrls(
                      getCommitUrlFromOtherUrl(commits[0].url)!,
                      getCommitUrlFromOtherUrl(
                        commits[commits.length - 1].url,
                      )!,
                    )!,
              subitems: commits
                .slice(0, sliceSize)
                .map<NonNullable<BaseCardProps['subitems']>[0]>(commit => ({
                  avatar: {
                    imageURL: getUserAvatarByEmail(commit.author.email, {
                      baseURL: getBaseUrlFromOtherUrl(commit.url),
                    }),
                    linkURL: commit.author.email
                      ? getGitHubSearchURL({
                          q: commit.author.email,
                          type: 'Users',
                        })
                      : '',
                  },
                  text: commit.message,
                }))
                .concat(
                  hasMoreCount
                    ? [
                        {
                          avatar: undefined,
                          text: `${hasMoreCount} more`,
                        },
                      ]
                    : [],
                ),
              subtitle: undefined,
              text: getRepoText({
                branchOrTagName,
                issueOrPullRequestNumber: undefined,
                ownerIsKnown: false,
                repoFullName: repoOwnerName,
                repoIsKnown: false,
              }),
              title: repoName!,
              type,
            }
          }

          if (release && (release.name || release.tag_name)) {
            return {
              action: actorActionOrUndefined,
              avatar: repoAvatar,
              date,
              icon,
              id,
              isPrivate,
              isRead,
              link: release.html_url || fixURL(release.url)!,
              subitems: [],
              subtitle: trimNewLinesAndSpaces(stripMarkdown(release.body), 120),
              text: getRepoText({
                branchOrTagName:
                  release.tag_name &&
                  release.name &&
                  release.tag_name !== release.name
                    ? release.tag_name
                    : undefined,
                issueOrPullRequestNumber: undefined,
                ownerIsKnown,
                repoFullName,
                repoIsKnown,
              }),
              title: release.name || release.tag_name,
              type,
            }
          }

          return {
            action: actorActionOrUndefined,
            avatar: repoAvatar,
            date,
            icon,
            id,
            isPrivate,
            isRead,
            link:
              (_comment && _comment.html_url) ||
              ('html_url' in event && event.html_url) ||
              ((subjectType === 'Repository' ||
                subjectType === 'RepositoryInvitation' ||
                subjectType === 'RepositoryVulnerabilityAlert') &&
                repoURL) ||
              (subjectType === 'User' && (users[0] && users[0].html_url)) ||
              (branchOrTagName &&
                ((isTagMainEvent &&
                  `${repoURL}/releases/tag/${branchOrTagName}`) ||
                  (isBranchMainEvent &&
                    `${repoURL}/tree/${branchOrTagName}`))) ||
              (__DEV__ ? '' : repoURL),
            subitems,
            subtitle: undefined,
            text: getRepoText({
              branchOrTagName:
                isBranchMainEvent || isTagMainEvent
                  ? branchOrTagName
                  : undefined,
              issueOrPullRequestNumber: undefined,
              ownerIsKnown: false,
              repoFullName: repoOwnerName,
              repoIsKnown: false,
            }),
            title: repoName!,
            type,
          }
        }
      }
    }

    case 'issue_or_pr': {
      const issueOrPullRequest = item as EnhancedGitHubIssueOrPullRequest

      const repoFullName = getRepoFullNameFromUrl(
        issueOrPullRequest.repository_url ||
          issueOrPullRequest.url ||
          issueOrPullRequest.html_url,
      )
      const { owner: repoOwnerName } = getOwnerAndRepo(repoFullName)

      const iconDetails = getIssueOrPullRequestIconAndColor(
        getIssueOrPullRequestSubjectType(issueOrPullRequest) || 'Issue',
        issueOrPullRequest,
      )
      const icon = { name: iconDetails.icon, color: iconDetails.color }

      const isRead = isItemRead(issueOrPullRequest)
      const isPrivate = isIssueOrPullRequestPrivate(issueOrPullRequest)

      return {
        action: undefined,
        avatar: ownerIsKnown
          ? {
              imageURL: getUserAvatarFromObject(issueOrPullRequest.user)!,
              linkURL: getUserURLFromObject(issueOrPullRequest.user)!,
            }
          : {
              imageURL: `${getBaseUrlFromOtherUrl(
                issueOrPullRequest.html_url || issueOrPullRequest.url,
              )}/${repoOwnerName}.png`,
              linkURL: getRepoUrlFromOtherUrl(
                issueOrPullRequest.html_url || issueOrPullRequest.url,
              )!,
            },
        date: issueOrPullRequest.updated_at || issueOrPullRequest.created_at,
        icon,
        id,
        isPrivate,
        isRead,
        link: fixURL(issueOrPullRequest.html_url, {
          addBottomAnchor: issueOrPullRequest.comments > 0,
          issueOrPullRequestNumber: issueOrPullRequest.number,
        })!,
        subitems: undefined,
        subtitle: undefined,
        text: getRepoText({
          repoFullName,
          ownerIsKnown,
          repoIsKnown,
          issueOrPullRequestNumber: issueOrPullRequest.number,
        }),
        title: issueOrPullRequest.title,
        type,
      }
    }

    case 'notifications': {
      const notification = item as EnhancedGitHubNotification

      const {
        comment: _comment,
        commit,
        isPrivate,
        isPrivateAndCantSee,
        isRead,
        issueOrPullRequest,
        issueOrPullRequestNumber,
        release,
        repo,
        repoFullName,
        subject,
      } = getGitHubNotificationSubItems(notification)

      const iconDetails = getNotificationIconAndColor(
        notification,
        (issueOrPullRequest || undefined) as any,
      )
      const icon = { name: iconDetails.icon, color: iconDetails.color }

      const subitems = ((): BaseCardProps['subitems'] => {
        if (!(_comment && _comment.body)) return undefined

        const trimmerBody =
          _comment && trimNewLinesAndSpaces(stripMarkdown(_comment.body), 120)
        if (!trimmerBody) return undefined

        return [
          {
            avatar: {
              imageURL: getUserAvatarFromObject(_comment.user)!,
              linkURL: getUserURLFromObject(_comment.user)!,
            },
            text: trimmerBody,
          },
        ]
      })()

      const repoURL = repo.html_url || getRepoUrlFromOtherUrl(repo.url)

      const defaultProps: Omit<BaseCardProps, 'height'> = {
        action: undefined,
        avatar: {
          imageURL:
            (repo.owner && getUserAvatarFromObject(repo.owner)) ||
            (repoURL && `${repoURL}.png`) ||
            '',
          linkURL: repoURL || '',
        },
        date: notification.updated_at,
        icon,
        id,
        isPrivate,
        isRead,
        link:
          fixURL(subject.url, {
            addBottomAnchor: true,
            commentId:
              (_comment && _comment.id && Number(_comment.id)) || undefined,
            issueOrPullRequestNumber,
          }) ||
          fixURL(subject.url, {
            addBottomAnchor: true,
            commentId:
              (_comment && _comment.id && Number(_comment.id)) || undefined,
            issueOrPullRequestNumber,
          })!,
        subitems,
        subtitle: undefined,
        text: getRepoText({
          repoFullName,
          ownerIsKnown,
          repoIsKnown,
          issueOrPullRequestNumber:
            (issueOrPullRequest && issueOrPullRequest.number) || undefined,
        }),
        title: subject.title,
        type,
        githubApp: isPrivateAndCantSee
          ? {
              ownerId: repo.owner && repo.owner.id,
              repoId: repo.id,
            }
          : undefined,
      }

      switch (notification.subject.type) {
        case 'Commit': {
          return {
            ...defaultProps,
            ...(commit &&
              ((commit.author && {
                avatar: {
                  imageURL: getUserAvatarFromObject(commit.author)!,
                  linkURL: getUserURLFromObject(commit.author)!,
                },
              }) || {
                avatar: {
                  imageURL: getUserAvatarByEmail(commit.commit.author.email, {
                    baseURL: getBaseUrlFromOtherUrl(commit.url),
                  }),
                  linkURL: commit.commit.author.email
                    ? getGitHubSearchURL({
                        q: commit.commit.author.email,
                        type: 'Users',
                      })
                    : '',
                },
              })),
          }
        }

        case 'Issue':
        case 'PullRequest': {
          return {
            ...defaultProps,
            ...(ownerIsKnown &&
              issueOrPullRequest && {
                avatar: {
                  imageURL: getUserAvatarFromObject(issueOrPullRequest.user)!,
                  linkURL: getUserURLFromObject(issueOrPullRequest.user)!,
                },
              }),
            ...(issueOrPullRequestNumber && {
              text: getRepoText({
                repoFullName,
                ownerIsKnown,
                repoIsKnown,
                issueOrPullRequestNumber:
                  (issueOrPullRequest && issueOrPullRequest.number) ||
                  undefined,
              }),
            }),
          }
        }

        case 'Release': {
          return {
            ...defaultProps,
            ...(release &&
              release.body && {
                subtitle: trimNewLinesAndSpaces(
                  stripMarkdown(release.body),
                  120,
                ),
              }),
          }
        }

        default:
          return defaultProps
      }
    }
  }
}

export function getCardPropsForItem(
  ...args: Parameters<typeof _getCardPropsForItem>
): BaseCardProps {
  const props = _getCardPropsForItem(...args)
  return { ...props, height: getCardSizeForProps(props) }
}

export function getCardSizeForProps(
  props: Omit<BaseCardProps, 'height'>,
): number {
  return (
    sizes.cardPadding * 2 +
    Math.max(
      sizes.avatarContainerHeight,
      sizes.rightInnerTopSpacing +
        (props.title ? sizes.rightTextLineHeight : 0) +
        (props.subtitle ? sizes.rightTextLineHeight : 0) +
        (props.text ? sizes.rightTextLineHeight : 0),
    ) +
    (props.action && props.action.text
      ? sizes.actionContainerHeight + sizes.verticalSpaceSize
      : 0) +
    (props.subitems && props.subitems.length
      ? props.subitems.length *
        (sizes.subitemContainerHeight + sizes.verticalSpaceSize)
      : 0) +
    (props.githubApp
      ? sizes.githubAppMessageContainerHeight + sizes.verticalSpaceSize
      : 0) +
    cardItemSeparatorSize
  )
}

export function getCardSizeForItem(
  ...args: Parameters<typeof getCardPropsForItem>
): number {
  return getCardSizeForProps(getCardPropsForItem(...args))
}
