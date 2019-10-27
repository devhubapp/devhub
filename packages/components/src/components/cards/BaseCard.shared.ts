import {
  cheapestPlanWithNotifications,
  Column,
  ColumnSubscription,
  constants,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  formatPriceAndInterval,
  getBaseUrlFromOtherUrl,
  getCommentIdFromUrl,
  getCommitCompareUrlFromRefs,
  getCommitCompareUrlFromUrls,
  getCommitUrlFromOtherUrl,
  getEventIconAndColor,
  getEventMetadata,
  getGitHubEventSubItems,
  getGitHubIssueOrPullRequestSubItems,
  getGitHubNotificationSubItems,
  getGitHubURLForSecurityAlert,
  getIssueOrPullRequestState,
  getItemNodeIdOrId,
  getItemSubjectType,
  getNotificationIconAndColor,
  getNotificationReasonMetadata,
  getOwnerAndRepo,
  getRepoFullNameFromUrl,
  getRepoUrlFromOtherUrl,
  getUserAvatarByAvatarURL,
  getUserAvatarByEmail,
  getUserAvatarByUsername,
  getUserAvatarFromObject,
  getUserURLFromEmail,
  getUserURLFromObject,
  GitHubIcon,
  GitHubIssueOrPullRequest,
  GitHubNotificationReason,
  GitHubPullRequest,
  GitHubPushEvent,
  isDraft,
  isItemRead,
  isItemSaved,
  isPullRequest,
  ItemPushNotification,
  Plan,
  stripMarkdown,
  ThemeColors,
  trimNewLinesAndSpaces,
  UserPlan,
} from '@devhub/core'
import { PixelRatio } from 'react-native'

import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { ExtractActionFromActionCreator } from '../../redux/types/base'
import {
  avatarSize,
  contentPadding,
  normalTextSize,
  smallAvatarSize,
  smallerTextSize,
  smallTextSize,
} from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import { cardActionsHeight } from './partials/CardActions'
import { cardItemSeparatorSize } from './partials/CardItemSeparator'

const _iconSize = smallAvatarSize - 4
const _iconContainerSize = smallAvatarSize
const _actionFontSize = smallerTextSize
const _subitemFontSize = smallTextSize
const _subitemLineHeight = _subitemFontSize + 2
export const sizes = {
  cardPadding: contentPadding * (2 / 3),
  iconSize: PixelRatio.roundToNearestPixel(_iconSize),
  iconContainerSize: _iconContainerSize,
  avatarContainerWidth: PixelRatio.roundToNearestPixel(
    avatarSize + _iconContainerSize / 3,
  ),
  avatarContainerHeight: PixelRatio.roundToNearestPixel(avatarSize),
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

export const renderCardActions =
  Platform.OS === 'web' || constants.DISABLE_SWIPEABLE_CARDS

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
  nodeIdOrId: string
  isRead: boolean
  isSaved: boolean
  link: string
  reason?: {
    reason: GitHubNotificationReason
    color: keyof ThemeColors
    label: string
    tooltip?: string
  }
  showPrivateLock: boolean
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
  text?: {
    text: string
    repo?: { owner: string; name: string; url: string }
  }
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

function getPrivateBannerCardProps(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
  props: Pick<BaseCardProps, 'avatar' | 'date'> & {
    iconColor: BaseCardProps['icon']['color']
  },
): Omit<BaseCardProps, 'height'> {
  const highlightFeature: keyof Plan['featureFlags'] =
    'enablePrivateRepositories'

  return {
    action: undefined,
    avatar: props.avatar,
    date: props.date,
    githubApp: undefined,
    icon: { color: props.iconColor || 'red', name: 'lock' },
    nodeIdOrId: getItemNodeIdOrId(item)!,
    isRead: isItemRead(item),
    isSaved: isItemSaved(item),
    link: `${constants.APP_DEEP_LINK_URLS.pricing}?highlightFeature=${highlightFeature}`,
    showPrivateLock: false,
    subitems: undefined,
    subtitle: undefined,
    text: {
      text:
        cheapestPlanWithNotifications && cheapestPlanWithNotifications.amount
          ? `Unlock private repos for ${formatPriceAndInterval(
              cheapestPlanWithNotifications.amount,
              cheapestPlanWithNotifications,
            )}`
          : 'Tap to unlock private repos',
    },
    title:
      type === 'activity'
        ? 'Private event'
        : type === 'notifications'
        ? 'Private notification'
        : type === 'issue_or_pr'
        ? isPullRequest(item as GitHubIssueOrPullRequest)
          ? isDraft(item as GitHubPullRequest)
            ? 'Private Draft Pull Request'
            : 'Private Pull Request'
          : 'Private Issue'
        : 'Private item',
    type,
  }
}

function _getCardPropsForItem(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
  {
    ownerIsKnown,
    plan,
    repoIsKnown,
  }: {
    ownerIsKnown: boolean
    plan: UserPlan | null | undefined
    repoIsKnown: boolean
  },
): Omit<BaseCardProps, 'height'> {
  switch (type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent

      const {
        actor,
        branchOrTagName,
        canSee,
        comment: _comment,
        commits,
        forkee,
        isBranchMainEvent,
        isPrivate,
        isRead,
        isSaved,
        isTagMainEvent,
        issueOrPullRequest,
        pages,
        release,
        repoFullName,
        repos,
        users,
      } = getGitHubEventSubItems(event, { plan })

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
        (repos[0].owner &&
          getUserAvatarFromObject(
            repos[0].owner,
            {},
            PixelRatio.getPixelSizeForLayoutSize,
          )) ||
        getUserAvatarByUsername(
          repoOwnerName || '',
          {
            baseURL: getBaseUrlFromOtherUrl(repoURL),
          },
          PixelRatio.getPixelSizeForLayoutSize,
        ) ||
        ''

      const forkURL = fixURL(
        forkee && (forkee.html_url || getRepoUrlFromOtherUrl(forkee.url)),
      )

      const actorAvatar: BaseCardProps['avatar'] = {
        imageURL: getUserAvatarFromObject(
          actor,
          {},
          PixelRatio.getPixelSizeForLayoutSize,
        )!,
        linkURL: getUserURLFromObject(actor)!,
      }

      const repoAvatar: BaseCardProps['avatar'] = {
        imageURL: repoImageURL,
        linkURL: repoURL,
      }

      const subjectType = getItemSubjectType('activity', event)

      if (isPrivate && !canSee) {
        return getPrivateBannerCardProps(type, item, {
          avatar: actorAvatar || repoAvatar,
          date,
          iconColor: icon.color,
        })
      }

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
                    imageURL: getUserAvatarFromObject(
                      _comment.user,
                      {},
                      PixelRatio.getPixelSizeForLayoutSize,
                    )!,
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
                nodeIdOrId: getItemNodeIdOrId(item)!,
                isRead,
                isSaved,
                link:
                  event.type === 'WatchEvent' && actorAvatar.linkURL
                    ? repoIsKnown
                      ? actorAvatar.linkURL
                      : `${actorAvatar.linkURL}?tab=stars&q=${repoFullName}`
                    : forkURL || repoURL,
                showPrivateLock: isPrivate,
                subitems: undefined,
                subtitle: undefined,
                text: {
                  text: actionText!,
                  repo: repoIsKnown
                    ? undefined
                    : {
                        owner: repoOwnerName!,
                        name: repoName!,
                        url: repoURL!,
                      },
                },
                title: actorUsername,
                type,
              }
            : {
                action: actorAction,
                avatar: repoAvatar,
                date,
                icon,
                nodeIdOrId: getItemNodeIdOrId(item)!,
                isRead,
                isSaved,
                link: forkURL || repoURL,
                showPrivateLock: isPrivate,
                subitems: undefined,
                subtitle: undefined,
                text: {
                  text: repoOwnerName!,
                  repo: {
                    owner: repoOwnerName!,
                    name: repoName!,
                    url: repoURL!,
                  },
                },
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
                    imageURL: getUserAvatarFromObject(
                      issueOrPullRequest.user,
                      {},
                      PixelRatio.getPixelSizeForLayoutSize,
                    )!,
                    linkURL: getUserURLFromObject(issueOrPullRequest.user)!,
                  }
                : repoAvatar,
              date,
              icon,
              nodeIdOrId: getItemNodeIdOrId(item)!,
              isRead,
              isSaved,
              link:
                (_comment &&
                  (_comment.html_url ||
                    fixURL(_comment.url, {
                      commentId:
                        Number.parseInt(`${_comment.id}`, 10) ||
                        getCommentIdFromUrl(_comment.url) ||
                        undefined,
                      commentIsInline: !!(_comment && _comment.path),
                    }))) ||
                fixURL(issueOrPullRequest.html_url || issueOrPullRequest.url)!,
              showPrivateLock: isPrivate,
              subitems,
              subtitle: undefined,
              text: {
                text: getRepoText({
                  repoFullName,
                  ownerIsKnown,
                  repoIsKnown,
                  issueOrPullRequestNumber: issueOrPullRequest.number,
                })!,
                repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
              },
              title: issueOrPullRequest.title,
              type,
            }
          }

          if (commits && commits.length === 1) {
            const commit = commits[0]

            return {
              action: actorActionOrUndefined,
              avatar: ownerIsKnown
                ? {
                    imageURL: getUserAvatarByEmail(
                      commit.author.email,
                      { baseURL: getBaseUrlFromOtherUrl(commit.url) },
                      PixelRatio.getPixelSizeForLayoutSize,
                    ),
                    linkURL:
                      (commit.author.email &&
                        getUserURLFromEmail(commit.author.email, {
                          baseURL: getBaseUrlFromOtherUrl(commit.url),
                        })) ||
                      '',
                  }
                : repoAvatar,
              date,
              icon,
              nodeIdOrId: getItemNodeIdOrId(item)!,
              isRead,
              isSaved,
              link:
                (_comment &&
                  (_comment.html_url ||
                    fixURL(_comment.url, {
                      commentId:
                        Number.parseInt(`${_comment.id}`, 10) ||
                        getCommentIdFromUrl(_comment.url) ||
                        undefined,
                      commentIsInline: !!(_comment && _comment.path),
                    }))) ||
                getCommitUrlFromOtherUrl(commit.url)!,
              showPrivateLock: isPrivate,
              subitems,
              subtitle: undefined,
              text: repoIsKnown
                ? { text: branchOrTagName! }
                : {
                    text: getRepoText({
                      branchOrTagName,
                      repoFullName,
                      ownerIsKnown,
                      repoIsKnown,
                      issueOrPullRequestNumber: undefined,
                    })!,
                    repo: {
                      owner: repoOwnerName!,
                      name: repoName!,
                      url: repoURL!,
                    },
                  },
              title: trimNewLinesAndSpaces(commit.message, 120),
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
              nodeIdOrId: getItemNodeIdOrId(item)!,
              isRead,
              isSaved,
              link:
                (_comment &&
                  (_comment.html_url ||
                    fixURL(_comment.url, {
                      commentId:
                        (_comment &&
                          (Number.parseInt(`${_comment.id}`, 10) ||
                            getCommentIdFromUrl(_comment.url))) ||
                        undefined,
                      commentIsInline: !!(_comment && _comment.path),
                    }))) ||
                total === 1
                  ? getCommitUrlFromOtherUrl(commits[0].url)!
                  : _event.payload.before && _event.payload.head
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
              showPrivateLock: isPrivate,
              subitems: commits
                .slice(0, sliceSize)
                .map<NonNullable<BaseCardProps['subitems']>[0]>(commit => ({
                  avatar: {
                    imageURL: getUserAvatarByEmail(
                      commit.author.email,
                      { baseURL: getBaseUrlFromOtherUrl(commit.url) },
                      PixelRatio.getPixelSizeForLayoutSize,
                    ),
                    linkURL:
                      (commit.author.email &&
                        getUserURLFromEmail(commit.author.email, {
                          baseURL: getBaseUrlFromOtherUrl(commit.url),
                        })) ||
                      '',
                  },
                  text: trimNewLinesAndSpaces(commit.message, 120),
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
              text: { text: branchOrTagName || 'master' },
              title: getRepoText({
                branchOrTagName: undefined,
                issueOrPullRequestNumber: undefined,
                ownerIsKnown: false,
                repoFullName,
                repoIsKnown: false,
              })!,
              type,
            }
          }

          if (
            pages &&
            pages.length >= 1 &&
            pages[0] &&
            (pages[0].title || pages[0]!.page_name)
          ) {
            const firstLink = pages
              .map(p => fixURL(p.html_url))
              .filter(Boolean)[0]

            return {
              action: actorActionOrUndefined,
              avatar: repoAvatar,
              date,
              icon,
              nodeIdOrId: getItemNodeIdOrId(item)!,
              isRead,
              isSaved,
              link:
                firstLink &&
                pages.length === 1 &&
                pages[0].sha &&
                pages[0].action !== 'created'
                  ? `${firstLink}/_compare/${pages[0].sha}`
                  : firstLink || '',
              showPrivateLock: isPrivate,
              subitems: undefined,
              subtitle: trimNewLinesAndSpaces(
                stripMarkdown(pages[0].summary || ''),
                120,
              ),
              text: {
                text: getRepoText({
                  branchOrTagName: undefined,
                  issueOrPullRequestNumber: undefined,
                  ownerIsKnown,
                  repoFullName,
                  repoIsKnown,
                })!,
                repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
              },
              title: pages[0].title || pages[0].page_name,
              type,
            }
          }

          if (release && (release.name || release.tag_name)) {
            return {
              action: actorActionOrUndefined,
              avatar: repoAvatar,
              date,
              icon,
              nodeIdOrId: getItemNodeIdOrId(item)!,
              isRead,
              isSaved,
              link:
                release.html_url ||
                fixURL(release.url, { tagName: branchOrTagName })!,
              showPrivateLock: isPrivate,
              subitems: [],
              subtitle: trimNewLinesAndSpaces(stripMarkdown(release.body), 120),
              text: {
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
                })!,
                repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
              },
              title: release.name || release.tag_name,
              type,
            }
          }

          return {
            action: actorActionOrUndefined,
            avatar: repoAvatar,
            date,
            icon,
            nodeIdOrId: getItemNodeIdOrId(item)!,
            isRead,
            isSaved,
            link:
              (_comment &&
                (_comment.html_url ||
                  fixURL(_comment.url, {
                    commentId:
                      (_comment &&
                        (Number.parseInt(`${_comment.id}`, 10) ||
                          getCommentIdFromUrl(_comment.url))) ||
                      undefined,
                    commentIsInline: !!(_comment && _comment.path),
                  }))) ||
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
            showPrivateLock: isPrivate,
            subitems,
            subtitle: undefined,
            text: {
              text: getRepoText({
                branchOrTagName:
                  isBranchMainEvent || isTagMainEvent
                    ? branchOrTagName
                    : undefined,
                issueOrPullRequestNumber: undefined,
                ownerIsKnown: false,
                repoFullName: repoOwnerName,
                repoIsKnown: false,
              })!,
              repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
            },
            title: repoName!,
            type,
          }
        }
      }
    }

    case 'issue_or_pr': {
      const issueOrPullRequest = item as EnhancedGitHubIssueOrPullRequest
      const {
        canSee,
        iconDetails,
        isPrivate,
        isRead,
        isSaved,
        repoFullName,
        repoOwnerName,
        repoName,
        repoURL,
      } = getGitHubIssueOrPullRequestSubItems(issueOrPullRequest, { plan })

      const avatar: BaseCardProps['avatar'] = ownerIsKnown
        ? {
            imageURL: getUserAvatarFromObject(
              issueOrPullRequest.user,
              {},
              PixelRatio.getPixelSizeForLayoutSize,
            )!,
            linkURL: getUserURLFromObject(issueOrPullRequest.user)!,
          }
        : {
            imageURL: getUserAvatarByUsername(
              repoOwnerName || '',
              {
                baseURL: getBaseUrlFromOtherUrl(
                  issueOrPullRequest.html_url || issueOrPullRequest.url,
                ),
              },
              PixelRatio.getPixelSizeForLayoutSize,
            ),
            linkURL: getRepoUrlFromOtherUrl(
              issueOrPullRequest.html_url || issueOrPullRequest.url,
            )!,
          }

      const date =
        issueOrPullRequest.updated_at || issueOrPullRequest.created_at

      const icon = { name: iconDetails.icon, color: iconDetails.color }

      if (isPrivate && !canSee) {
        return getPrivateBannerCardProps(type, item, {
          avatar,
          date,
          iconColor: icon.color,
        })
      }

      return {
        action: undefined,
        avatar,
        date,
        icon,
        nodeIdOrId: getItemNodeIdOrId(item)!,
        isRead,
        isSaved,
        link: fixURL(issueOrPullRequest.html_url, {
          addBottomAnchor: issueOrPullRequest.comments > 0,
          issueOrPullRequestNumber: issueOrPullRequest.number,
        })!,
        showPrivateLock: isPrivate,
        subitems: undefined,
        subtitle: undefined,
        text: {
          text: getRepoText({
            repoFullName,
            ownerIsKnown,
            repoIsKnown,
            issueOrPullRequestNumber: issueOrPullRequest.number,
          })!,
          repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
        },
        title: issueOrPullRequest.title,
        type,
      }
    }

    case 'notifications': {
      const notification = item as EnhancedGitHubNotification

      const {
        canSee,
        comment: _comment,
        commit,
        isPrivate,
        isRead,
        isSaved,
        issueOrPullRequest,
        issueOrPullRequestNumber,
        release,
        repo,
        repoFullName,
        subject,
      } = getGitHubNotificationSubItems(notification, { plan })

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
              imageURL: getUserAvatarFromObject(
                _comment.user,
                {},
                PixelRatio.getPixelSizeForLayoutSize,
              )!,
              linkURL: getUserURLFromObject(_comment.user)!,
            },
            text: trimmerBody,
          },
        ]
      })()

      const repoURL = repo.html_url || getRepoUrlFromOtherUrl(repo.url)
      const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
        repoFullName,
      )

      const reasonMetadata = getNotificationReasonMetadata(notification.reason)

      const defaultProps: Omit<BaseCardProps, 'height'> = {
        action: undefined,
        avatar: {
          imageURL:
            (repo.owner &&
              getUserAvatarFromObject(
                repo.owner,
                {},
                PixelRatio.getPixelSizeForLayoutSize,
              )) ||
            getUserAvatarByUsername(
              repoOwnerName!,
              {
                baseURL: getBaseUrlFromOtherUrl(repoURL),
              },
              PixelRatio.getPixelSizeForLayoutSize,
            ) ||
            '',
          linkURL: repoURL || '',
        },
        date: notification.updated_at,
        icon,
        nodeIdOrId: getItemNodeIdOrId(item)!,
        isRead,
        isSaved,
        link:
          (subject.type === 'RepositoryVulnerabilityAlert' &&
            getGitHubURLForSecurityAlert(repoURL)) ||
          fixURL(subject.latest_comment_url, {
            addBottomAnchor: !release,
            commentId:
              (_comment &&
                (Number.parseInt(`${_comment.id}`, 10) ||
                  getCommentIdFromUrl(_comment.url))) ||
              undefined,
            commentIsInline: !!(_comment && _comment.path),
            issueOrPullRequestNumber,
            tagName: release && release.tag_name,
          }) ||
          fixURL(subject.url, {
            addBottomAnchor: !release,
            commentId:
              (_comment &&
                (Number.parseInt(`${_comment.id}`, 10) ||
                  getCommentIdFromUrl(_comment.url))) ||
              undefined,
            commentIsInline: !!(_comment && _comment.path),
            issueOrPullRequestNumber,
            tagName: release && release.tag_name,
          }) ||
          repoURL!,
        reason: {
          color: reasonMetadata.color,
          label: reasonMetadata.label,
          reason: reasonMetadata.reason,
          tooltip: reasonMetadata.fullDescription,
        },
        showPrivateLock: isPrivate,
        subitems,
        subtitle: undefined,
        text: {
          text: getRepoText({
            repoFullName,
            ownerIsKnown,
            repoIsKnown,
            issueOrPullRequestNumber:
              (issueOrPullRequest && issueOrPullRequest.number) || undefined,
          })!,
          repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
        },
        title: trimNewLinesAndSpaces(subject.title, 120),
        type,
        githubApp:
          isPrivate && !notification.enhanced
            ? {
                ownerId: repo.owner && repo.owner.id,
                repoId: repo.id,
              }
            : undefined,
      }

      if (isPrivate && !canSee) {
        return getPrivateBannerCardProps(type, item, {
          avatar: defaultProps.avatar,
          date: defaultProps.date,
          iconColor: defaultProps.icon.color,
        })
      }

      switch (notification.subject.type) {
        case 'Commit': {
          return {
            ...defaultProps,
            ...(commit &&
              ((commit.author && {
                avatar: {
                  imageURL:
                    getUserAvatarFromObject(
                      commit.author,
                      {},
                      PixelRatio.getPixelSizeForLayoutSize,
                    ) || defaultProps.avatar.imageURL,
                  linkURL: getUserURLFromObject(commit.author)!,
                },
              }) || {
                avatar: {
                  imageURL:
                    getUserAvatarByEmail(
                      commit.commit.author.email,
                      {
                        baseURL: getBaseUrlFromOtherUrl(commit.url),
                      },
                      PixelRatio.getPixelSizeForLayoutSize,
                    ) || defaultProps.avatar.imageURL,
                  linkURL:
                    (commit.commit.author.email &&
                      getUserURLFromEmail(commit.commit.author.email, {
                        baseURL: getBaseUrlFromOtherUrl(commit.url),
                      })) ||
                    '',
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
                  imageURL:
                    getUserAvatarFromObject(
                      issueOrPullRequest.user,
                      {},
                      PixelRatio.getPixelSizeForLayoutSize,
                    ) || defaultProps.avatar.imageURL,
                  linkURL:
                    getUserURLFromObject(issueOrPullRequest.user) ||
                    defaultProps.avatar.linkURL,
                },
              }),
            ...(issueOrPullRequestNumber && {
              text: {
                text: getRepoText({
                  repoFullName,
                  ownerIsKnown,
                  repoIsKnown,
                  issueOrPullRequestNumber:
                    (issueOrPullRequest && issueOrPullRequest.number) ||
                    undefined,
                })!,
                repo: { owner: repoOwnerName!, name: repoName!, url: repoURL! },
              },
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
  if (!props) return 0

  return (
    sizes.cardPadding * 2 +
    Math.max(
      sizes.avatarContainerHeight,
      sizes.rightInnerTopSpacing +
        (props.title ? sizes.rightTextLineHeight : 0) +
        (props.subtitle ? sizes.rightTextLineHeight : 0) +
        (props.text && props.text.text ? sizes.rightTextLineHeight : 0),
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
    (renderCardActions ? cardActionsHeight + sizes.verticalSpaceSize : 0) +
    cardItemSeparatorSize
  )
}

export function getCardSizeForItem(
  ...args: Parameters<typeof getCardPropsForItem>
): number {
  return getCardSizeForProps(getCardPropsForItem(...args))
}

export interface CardPushNotification
  extends ItemPushNotification<
    ExtractActionFromActionCreator<typeof actions.openItem>
  > {}
export function getCardPushNotificationItem(
  column: Pick<Column, 'type' | 'id'>,
  item: EnhancedItem,
  {
    ownerIsKnown,
    plan,
    repoIsKnown,
  }: {
    ownerIsKnown: boolean
    plan: UserPlan | null | undefined
    repoIsKnown: boolean
  },
): CardPushNotification {
  const cardProps = getCardPropsForItem(column.type, item, {
    ownerIsKnown,
    plan,
    repoIsKnown,
  })

  const onClickDispatchAction: CardPushNotification['onClickDispatchAction'] = {
    type: 'OPEN_ITEM',
    payload: {
      columnType: column.type,
      columnId: column.id,
      itemNodeIdOrId: getItemNodeIdOrId(item)!,
      link: cardProps.link,
    },
  }

  const notificationSize = 100

  switch (column.type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent

      const {
        actor,
        branchOrTagName,
        comment: _comment,
        commits,
        isBranchMainEvent,
        issueOrPullRequest,
        release,
        repoFullName,
      } = getGitHubEventSubItems(event, { plan })

      const actionTextOptions: Parameters<typeof getEventMetadata>[1] = {
        appendColon: false,
        commitIsKnown: false,
        includeBranch: false,
        includeFork: false,
        includeRepo: false,
        includeTag: false,
        includeUser: true,
        issueOrPullRequestIsKnown: false,
        ownerIsKnown: false,
        repoIsKnown: false,
      }
      const {
        actionText: _actionText,
        action: actionType,
        subjectType,
      } = getEventMetadata(event, actionTextOptions)

      const actionText = `${_actionText
        .substr(0, 1)
        .toLowerCase()}${_actionText.substr(1)}`

      const actorUsername = actor.display_login || actor.login

      const actionTextOrUndefined =
        _comment &&
        _comment.body &&
        (actionType === 'commented' || actionType === 'reviewed') &&
        (subjectType === 'Commit' ? !!commits[0] : true)
          ? undefined
          : actionText

      const _texts = [
        actionTextOrUndefined
          ? `@${actorUsername} ${actionTextOrUndefined}`
          : undefined,

        (issueOrPullRequest && issueOrPullRequest.title) ||
          (commits &&
            commits.length === 1 &&
            commits[0] &&
            commits[0].message &&
            trimNewLinesAndSpaces(stripMarkdown(commits[0].message), 80)) ||
          (release && (release.name || release.tag_name)) ||
          undefined,
        commits &&
          commits.length > 1 &&
          commits
            .map(
              commit =>
                commit.message &&
                commit &&
                trimNewLinesAndSpaces(stripMarkdown(commit.message), 80),
            )
            .filter(Boolean)
            .join('\n'),
        _comment &&
          _comment.body &&
          trimNewLinesAndSpaces(
            stripMarkdown(`@${_comment.user.login}: "${_comment.body}"`),
            80,
          ),
      ]
        .map(text => (text && trimNewLinesAndSpaces(text, 80)) || '')
        .filter(Boolean)

      const texts = _texts
        .slice(0, 1)
        .concat(
          getRepoText({
            branchOrTagName: isBranchMainEvent ? branchOrTagName : undefined,
            repoFullName,
            ownerIsKnown: false,
            repoIsKnown: false,
            issueOrPullRequestNumber:
              issueOrPullRequest && issueOrPullRequest.number,
          })!,
        )
        .concat(_texts.slice(1))
        .filter(Boolean)

      return {
        title: texts[0]!,
        subtitle: texts.length > 2 ? texts[1]! : undefined,
        body: texts.slice(texts.length > 2 ? 2 : 1).join('\n'),
        imageURL:
          (_comment &&
            getUserAvatarFromObject(
              _comment.user,
              { size: notificationSize },
              PixelRatio.getPixelSizeForLayoutSize,
            )) ||
          getUserAvatarByAvatarURL(
            cardProps.avatar.imageURL,
            { size: notificationSize },
            PixelRatio.getPixelSizeForLayoutSize,
          ),
        onClickDispatchAction,
      }
    }

    case 'issue_or_pr': {
      const issueOrPullRequest = item as EnhancedGitHubIssueOrPullRequest

      const repoURL =
        issueOrPullRequest.repository_url ||
        getRepoUrlFromOtherUrl(
          issueOrPullRequest.html_url || issueOrPullRequest.url,
        )
      const repoFullName = getRepoFullNameFromUrl(
        repoURL || issueOrPullRequest.url || issueOrPullRequest.html_url,
      )

      return {
        title: trimNewLinesAndSpaces(issueOrPullRequest.title, 80),
        subtitle: undefined,
        body: [
          getRepoText({
            repoFullName,
            ownerIsKnown: false,
            repoIsKnown: false,
            issueOrPullRequestNumber: issueOrPullRequest.number,
          })!,
          getIssueOrPullRequestState(issueOrPullRequest)
            ? `Status: ${getIssueOrPullRequestState(issueOrPullRequest)} ${
                isPullRequest(issueOrPullRequest)
                  ? isDraft(issueOrPullRequest as GitHubPullRequest)
                    ? 'draft pull request'
                    : 'pull request'
                  : 'issue'
              }`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
        imageURL: getUserAvatarByAvatarURL(
          cardProps.avatar.imageURL,
          { size: notificationSize },
          PixelRatio.getPixelSizeForLayoutSize,
        ),
        onClickDispatchAction,
      }
    }

    case 'notifications': {
      const notification = item as EnhancedGitHubNotification

      const {
        comment: _comment,
        issueOrPullRequest,
        release,
        repoFullName,
        subject,
      } = getGitHubNotificationSubItems(notification, { plan })

      return {
        title: trimNewLinesAndSpaces(subject.title, 80),
        subtitle: getRepoText({
          repoFullName,
          ownerIsKnown: false,
          repoIsKnown: false,
          issueOrPullRequestNumber:
            issueOrPullRequest && issueOrPullRequest.number,
        })!,
        body:
          (release &&
            release.body &&
            trimNewLinesAndSpaces(stripMarkdown(release.body), 80)) ||
          (_comment &&
            _comment.body &&
            trimNewLinesAndSpaces(
              stripMarkdown(`@${_comment.user.login}: "${_comment.body}"`),
              80,
            )) ||
          (issueOrPullRequest && getIssueOrPullRequestState(issueOrPullRequest)
            ? `Status: ${getIssueOrPullRequestState(issueOrPullRequest)} ${
                isPullRequest(issueOrPullRequest)
                  ? isDraft(issueOrPullRequest as GitHubPullRequest)
                    ? 'draft pull request'
                    : 'pull request'
                  : 'issue'
              }`
            : ''),
        imageURL:
          (_comment &&
            getUserAvatarFromObject(
              _comment.user,
              { size: notificationSize },
              PixelRatio.getPixelSizeForLayoutSize,
            )) ||
          getUserAvatarByAvatarURL(
            cardProps.avatar.imageURL,
            { size: notificationSize },
            PixelRatio.getPixelSizeForLayoutSize,
          ),
        onClickDispatchAction,
      }
    }
  }
}
