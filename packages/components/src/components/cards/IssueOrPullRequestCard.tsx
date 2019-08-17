import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  EnhancedGitHubIssueOrPullRequest,
  getDateSmallText,
  getFullDateText,
  getGitHubURLForRepo,
  getIssueOrPullRequestIconAndColor,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getRepoFullNameFromUrl,
  GitHubIssueOrPullRequestSubjectType,
  isItemRead,
} from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  mutedOpacity,
} from '../../styles/variables'
import { tryFocus } from '../../utils/helpers/shared'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { CardActions } from './partials/CardActions'
import { CardBookmarkIndicator } from './partials/CardBookmarkIndicator'
import { CardBorder } from './partials/CardBorder'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { topCardMargin } from './partials/rows/styles'
import { cardStyles, spacingBetweenLeftAndRightColumn } from './styles'

export interface IssueOrPullRequestCardProps {
  isFocused?: boolean
  isPrivate?: boolean
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest
  repoIsKnown: boolean
  swipeable: boolean
  type: GitHubIssueOrPullRequestSubjectType
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const {
      isFocused,
      isPrivate,
      issueOrPullRequest,
      repoIsKnown,
      swipeable,
      type,
    } = props

    const itemRef = useRef<View>(null)

    useEffect(() => {
      if (Platform.OS === 'web' && isFocused && itemRef.current) {
        tryFocus(itemRef.current)
      }
    }, [isFocused])

    if (!issueOrPullRequest) return null

    const {
      id,
      repository_url,
      saved,
      url,
      html_url: htmlURL,
    } = issueOrPullRequest as EnhancedGitHubIssueOrPullRequest

    const repoFullName = getRepoFullNameFromUrl(
      repository_url || url || htmlURL,
    )
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    const issueOrPullRequestNumber = issueOrPullRequest
      ? issueOrPullRequest.number ||
        getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
      : undefined

    const isRead = isItemRead(issueOrPullRequest)
    const isSaved = saved === true
    const muted = false // isRead
    const showCardBorder = !Platform.supportsTouch && isFocused

    const repo = {
      id: '',
      fork: false,
      private: false,
      full_name: repoFullName,
      owner: { login: repoOwnerName } as any,
      name: repoName,
      url: repository_url || getGitHubURLForRepo(repoOwnerName!, repoName!)!,
      html_url: getGitHubURLForRepo(repoOwnerName!, repoName!)!,
    }

    const cardIconDetails = getIssueOrPullRequestIconAndColor(
      type,
      issueOrPullRequest,
    )
    const cardIconName = cardIconDetails.icon
    const cardIconColor = cardIconDetails.color

    const showCardActions = !swipeable

    let withTopMargin = false
    let withTopMarginCount = withTopMargin ? 1 : 0
    function getWithTopMargin() {
      const _withTopMargin = withTopMargin
      withTopMargin = true
      withTopMarginCount = withTopMarginCount + 1
      return _withTopMargin
    }

    function renderContent() {
      const TimestampComponent = !!issueOrPullRequest.updated_at && (
        <View style={[cardStyles.itemFixedHeight, sharedStyles.horizontal]}>
          <Spacer width={contentPadding / 2} />

          <IntervalRefresh date={issueOrPullRequest.updated_at}>
            {() => {
              const createdAt = issueOrPullRequest.created_at
              const updatedAt = issueOrPullRequest.updated_at

              const dateText = getDateSmallText(updatedAt, false)
              if (!dateText) return null

              return (
                <>
                  <ThemedText
                    color={
                      muted
                        ? 'foregroundColorMuted40'
                        : 'foregroundColorMuted65'
                    }
                    numberOfLines={1}
                    style={cardStyles.smallerText}
                    {...Platform.select({
                      web: {
                        title: `${
                          createdAt
                            ? `Created: ${getFullDateText(createdAt)}\n`
                            : ''
                        }Updated: ${getFullDateText(updatedAt)}`,
                      },
                    })}
                  >
                    {/* <ThemedIcon
                                name="clock"
                                style={cardStyles.smallerText}
                              />{' '} */}
                    {dateText}
                  </ThemedText>
                </>
              )
            }}
          </IntervalRefresh>

          <Spacer width={contentPadding / 3} />
        </View>
      )

      let hasRenderedTimestampComponent = false
      function maybeRenderTimestampComponent() {
        if (hasRenderedTimestampComponent) return null

        hasRenderedTimestampComponent = true

        return TimestampComponent
      }

      return (
        <>
          {!!(repoOwnerName && repoName && !repoIsKnown) && (
            <View
              style={[
                sharedStyles.flexGrow,
                sharedStyles.horizontal,
                { maxWidth: '100%' },
              ]}
            >
              <RepositoryRow
                key={`issue-or-pr-repo-row-${repo.id}`}
                containerStyle={sharedStyles.flex}
                muted={muted}
                ownerName={repoOwnerName}
                repositoryName={repoName}
                rightContainerStyle={sharedStyles.flex}
                small
                withTopMargin={getWithTopMargin()}
              />

              {maybeRenderTimestampComponent()}
            </View>
          )}

          {!!issueOrPullRequest && (
            <IssueOrPullRequestRow
              key={`issue-or-pr-issue-or-pr-row-${issueOrPullRequest.id}`}
              addBottomAnchor={false}
              avatarUrl={issueOrPullRequest.user.avatar_url}
              backgroundThemeColor={theme =>
                getCardBackgroundThemeColor(theme, { muted: isRead })
              }
              body={issueOrPullRequest.body}
              bold={!isRead}
              commentsCount={
                showCardActions ? undefined : issueOrPullRequest.comments
              }
              createdAt={issueOrPullRequest.created_at}
              // updatedAt={issueOrPullRequest.updated_at}
              hideIcon
              hideLabelText={false}
              // iconColor={issueIconColor || pullRequestIconColor}
              // iconName={issueIconName! || pullRequestIconName}
              id={issueOrPullRequest.id}
              isPrivate={!!isPrivate}
              muted={muted}
              issueOrPullRequestNumber={issueOrPullRequestNumber!}
              labels={issueOrPullRequest.labels}
              owner={repoOwnerName || ''}
              repo={repoName || ''}
              rightTitle={
                <>
                  {maybeRenderTimestampComponent()}
                  <Spacer width={contentPadding / 3} />
                </>
              }
              showBodyRow={
                false
                // issueOrPullRequest &&
                // issueOrPullRequest.state === 'open' &&
                // issueOrPullRequest.body
                //   ? true
                //   : false
              }
              showCreationDetails={false}
              title={issueOrPullRequest.title}
              url={issueOrPullRequest.url}
              userLinkURL={issueOrPullRequest.user.html_url || ''}
              username={issueOrPullRequest.user.login || ''}
              withTopMargin={getWithTopMargin()}
            />
          )}
        </>
      )
    }

    const Content = renderContent()

    return (
      <ThemedView
        key={`issue-or-pr-card-${id}-inner`}
        ref={itemRef}
        backgroundColor={theme =>
          getCardBackgroundThemeColor(theme, { muted: isRead })
        }
        style={cardStyles.container}
      >
        {!!isSaved && <CardBookmarkIndicator />}
        {!!showCardBorder && <CardBorder />}

        <View style={sharedStyles.flex}>
          <View
            style={[
              { alignItems: 'flex-start', width: '100%' },
              sharedStyles.horizontal,
            ]}
          >
            <Spacer width={contentPadding / 3} />

            <View
              style={[cardStyles.itemFixedWidth, cardStyles.itemFixedMinHeight]}
            >
              <ThemedIcon
                color={cardIconColor || 'foregroundColor'}
                name={cardIconName}
                selectable={false}
                style={[
                  sharedStyles.textCenter,
                  {
                    fontSize: columnHeaderItemContentSize,
                    opacity: muted ? mutedOpacity : 1,
                  },
                ]}
                {...!!cardIconDetails.tooltip &&
                  Platform.select({
                    web: { title: cardIconDetails.tooltip },
                  })}
              />
            </View>

            <Spacer width={spacingBetweenLeftAndRightColumn} />

            <View style={sharedStyles.flex}>
              {/* <IssueOrPullRequestCardHeader
              key={`issue-or-pr-card-header-${id}`}
              actionText=""
              avatarUrl={avatarUrl}
              backgroundThemeColor={backgroundThemeColor}
              cardIconColor={cardIconColor}
              cardIconName={cardIconName}
              date={issueOrPullRequest.created_at}
              ids={
                ('merged' in issueOrPullRequest &&
                  issueOrPullRequest.merged) || [id]
              }
              isBot={isBot}
              isPrivate={isPrivate}
              isSaved={isSaved}
              muted={muted}
              smallLeftColumn={false}
              userLinkURL={actor.html_url || ''}
              username={actor.display_login || actor.login}
            /> */}

              <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
                {/* <Spacer width={leftColumnBigSize - leftColumnSmallSize} /> */}

                <View style={sharedStyles.flex}>{Content}</View>
              </View>
            </View>
          </View>

          {!!showCardActions && (
            <>
              <Spacer height={topCardMargin} />

              <CardActions
                commentsCount={
                  issueOrPullRequest ? issueOrPullRequest.comments : undefined
                }
                commentsLink={
                  (issueOrPullRequest &&
                    (issueOrPullRequest.html_url || issueOrPullRequest.url)) ||
                  undefined
                }
                isRead={isRead}
                isSaved={isSaved}
                itemIds={[id]}
                muted={muted}
                type="issue_or_pr"
              />
            </>
          )}

          <Spacer width={contentPadding / 3} />
        </View>
      </ThemedView>
    )
  },
)

IssueOrPullRequestCard.displayName = 'IssueOrPullRequestCard'
