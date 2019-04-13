import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubIssueOrPullRequest,
  getDateSmallText,
  getFullDateText,
  getGitHubURLForRepo,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getRepoFullNameFromUrl,
  GitHubIssueOrPullRequestSubjectType,
  isItemRead,
  Theme,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  smallAvatarSize,
  smallerTextSize,
} from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { getIssueOrPullRequestIconAndColor } from '../../utils/helpers/github/issues'
import { tryFocus } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { getColumnCardThemeColors } from '../columns/ColumnRenderer'
import { Avatar } from '../common/Avatar'
import { BookmarkButton } from '../common/BookmarkButton'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { ToggleReadButton } from '../common/ToggleReadButton'
import { useTheme } from '../context/ThemeContext'
import { CardFocusBorder } from './partials/CardFocusBorder'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { cardStyles, getCardStylesForTheme } from './styles'

export interface IssueOrPullRequestCardProps {
  cardViewMode: CardViewMode
  isFocused?: boolean
  isPrivate?: boolean
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest
  repoIsKnown: boolean
  type: GitHubIssueOrPullRequestSubjectType
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const {
      cardViewMode,
      isFocused,
      isPrivate,
      issueOrPullRequest,
      repoIsKnown,
      type,
    } = props

    const itemRef = useRef<View>(null)
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const themeRef = useRef<Theme | null>(null)
    const initialTheme = useTheme(theme => {
      themeRef.current = theme

      if (itemRef.current) {
        itemRef.current.setNativeProps({
          style: {
            backgroundColor: theme[getBackgroundThemeColor()],
          },
        })
      }
    })
    themeRef.current = initialTheme

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
      user,
    } = issueOrPullRequest as EnhancedGitHubIssueOrPullRequest

    const repoFullName = getRepoFullNameFromUrl(repository_url || url)
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    const issueOrPullRequestNumber = issueOrPullRequest
      ? issueOrPullRequest.number ||
        getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
      : undefined

    const isRead = isItemRead(issueOrPullRequest)
    const isSaved = saved === true

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

    const isBot = Boolean(
      user && user.login && user.login.indexOf('[bot]') >= 0,
    )

    const cardIconDetails = getIssueOrPullRequestIconAndColor(
      type,
      issueOrPullRequest,
    )
    const cardIconName = cardIconDetails.icon
    const _cardIconColor = cardIconDetails.color

    function getBackgroundThemeColor() {
      const backgroundThemeColors = getColumnCardThemeColors(
        themeRef.current!.backgroundColor,
      )
      const _backgroundThemeColor =
        // (isFocused && 'backgroundColorLess2') ||
        (isRead && backgroundThemeColors.read) || backgroundThemeColors.unread

      return _backgroundThemeColor
    }

    const backgroundThemeColor = getBackgroundThemeColor()

    const cardIconColor =
      _cardIconColor &&
      getReadableColor(
        _cardIconColor,
        themeRef.current![backgroundThemeColor],
        0.3,
      )

    let withTopMargin = false
    function getWithTopMargin() {
      const _withTopMargin = withTopMargin
      withTopMargin = true
      return _withTopMargin
    }

    function renderContent() {
      return (
        <>
          {!!(
            repoOwnerName &&
            repoName &&
            !repoIsKnown &&
            cardViewMode !== 'compact'
          ) && (
            <RepositoryRow
              key={`issue-or-pr-repo-row-${repo.id}`}
              isRead={isRead}
              ownerName={repoOwnerName}
              repositoryName={repoName}
              small
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}

          {!!issueOrPullRequest && (
            <IssueOrPullRequestRow
              key={`issue-or-pr-issue-or-pr-row-${issueOrPullRequest.id}`}
              addBottomAnchor={false}
              avatarUrl={issueOrPullRequest.user.avatar_url}
              body={issueOrPullRequest.body}
              bold
              commentsCount={issueOrPullRequest.comments}
              createdAt={
                cardViewMode === 'compact'
                  ? issueOrPullRequest.created_at
                  : undefined
              }
              updatedAt={
                cardViewMode === 'compact'
                  ? undefined
                  : issueOrPullRequest.updated_at
              }
              hideIcon
              // iconColor={issueIconColor || pullRequestIconColor}
              // iconName={issueIconName! || pullRequestIconName}
              id={issueOrPullRequest.id}
              isPrivate={!!isPrivate}
              isRead={isRead}
              issueOrPullRequestNumber={issueOrPullRequestNumber!}
              labels={issueOrPullRequest.labels}
              owner={repoOwnerName || ''}
              repo={repoName || ''}
              showBodyRow={
                false
                // issueOrPullRequest &&
                // issueOrPullRequest.state === 'open' &&
                // issueOrPullRequest.body
                //   ? true
                //   : false
              }
              showCreationDetails
              title={issueOrPullRequest.title}
              url={issueOrPullRequest.url}
              userLinkURL={issueOrPullRequest.user.html_url || ''}
              username={issueOrPullRequest.user.login || ''}
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}
        </>
      )
    }

    const Content = renderContent()

    const isSingleRow = false

    if (cardViewMode === 'compact') {
      return (
        <SpringAnimatedView
          key={`issue-or-pr-card-${id}-compact-inner`}
          ref={itemRef}
          style={[
            cardStyles.compactContainer,
            isSingleRow && { alignItems: 'center' },
            {
              backgroundColor: springAnimatedTheme[backgroundThemeColor],
            },
          ]}
        >
          {!!isFocused && <CardFocusBorder />}

          {/* <CenterGuide /> */}

          {/* <View
          style={[cardStyles.compactItemFixedWidth, cardStyles.compactItemFixedHeight]}
        >
          <SpringAnimatedCheckbox analyticsLabel={undefined} size={columnHeaderItemContentSize} />
        </View>

        <Spacer width={contentPadding} /> */}

          <View style={cardStyles.compactItemFixedHeight}>
            <BookmarkButton
              isSaved={isSaved}
              itemIds={[id]}
              size={columnHeaderItemContentSize}
            />
          </View>

          <Spacer width={(contentPadding * 2) / 3} />

          {!repoIsKnown && (
            <>
              <View
                style={[
                  cardStyles.compactItemFixedHeight,
                  { width: smallAvatarSize },
                ]}
              >
                <Avatar
                  isBot={isBot}
                  linkURL=""
                  small
                  size={smallAvatarSize}
                  username={repoOwnerName}
                />
              </View>

              <Spacer width={contentPadding} />

              <View
                style={[
                  cardStyles.compactItemFixedMinHeight,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: 100,
                    overflow: 'hidden',
                  },
                ]}
              >
                {!!(repoOwnerName && repoName) && (
                  <RepositoryRow
                    key={`issue-or-pr-repo-row-${repoOwnerName}-${repoName}`}
                    disableLeft
                    // hideOwner
                    isRead={isRead}
                    ownerName={repoOwnerName}
                    repositoryName={repoName}
                    rightContainerStyle={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      width: 100,
                    }}
                    small
                    viewMode={cardViewMode}
                    withTopMargin={false}
                  />
                )}
              </View>

              <Spacer width={contentPadding} />
            </>
          )}

          <View
            style={[
              sharedStyles.flex,
              sharedStyles.horizontal,
              { alignItems: 'flex-start' },
            ]}
          >
            <View
              style={[
                cardStyles.compactItemFixedWidth,
                cardStyles.compactItemFixedHeight,
              ]}
            >
              <SpringAnimatedIcon
                name={cardIconName}
                selectable={false}
                style={{
                  fontSize: columnHeaderItemContentSize,
                  textAlign: 'center',
                  color: cardIconColor || springAnimatedTheme.foregroundColor,
                }}
              />
            </View>

            <Spacer width={contentPadding} />

            <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
              <View style={sharedStyles.flex}>{Content}</View>

              <Spacer width={contentPadding / 3} />
            </View>
          </View>

          <Spacer width={contentPadding} />

          <View style={{ alignItems: 'flex-end' }}>
            {!!issueOrPullRequest.created_at && (
              <IntervalRefresh date={issueOrPullRequest.created_at}>
                {() => {
                  const dateText = getDateSmallText(
                    issueOrPullRequest.updated_at,
                    false,
                  )
                  if (!dateText) return null

                  return (
                    <SpringAnimatedText
                      numberOfLines={1}
                      style={[
                        getCardStylesForTheme(springAnimatedTheme)
                          .timestampText,
                        cardStyles.smallText,
                        { fontSize: smallerTextSize },
                      ]}
                      {...Platform.select({
                        web: {
                          title: `Updated: ${getFullDateText(
                            issueOrPullRequest.updated_at,
                          )}`,
                        },
                      })}
                    >
                      {/* <SpringAnimatedIcon name="clock" />{' '} */}
                      {dateText}
                    </SpringAnimatedText>
                  )
                }}
              </IntervalRefresh>
            )}
          </View>

          <Spacer width={contentPadding / 2} />

          <View style={cardStyles.compactItemFixedHeight}>
            <ToggleReadButton
              isRead={isRead}
              itemIds={[id]}
              size={columnHeaderItemContentSize}
              type="issue_or_pr"
            />
          </View>
        </SpringAnimatedView>
      )
    }

    return (
      <SpringAnimatedView
        key={`issue-or-pr-card-${id}-inner`}
        ref={itemRef}
        style={[
          cardStyles.container,
          {
            backgroundColor: springAnimatedTheme[backgroundThemeColor],
          },
        ]}
      >
        {!!isFocused && <CardFocusBorder />}

        <View
          style={[
            sharedStyles.flex,
            sharedStyles.horizontal,
            { alignItems: 'flex-start' },
          ]}
        >
          <Spacer width={contentPadding / 3} />

          <View
            style={[cardStyles.itemFixedWidth, cardStyles.itemFixedMinHeight]}
          >
            <SpringAnimatedIcon
              name={cardIconName}
              selectable={false}
              style={{
                fontSize: columnHeaderItemContentSize,
                textAlign: 'center',
                color: cardIconColor || springAnimatedTheme.foregroundColor,
              }}
            />
          </View>

          <Spacer width={contentPadding} />

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
              isRead={isRead}
              isSaved={isSaved}
              smallLeftColumn={false}
              userLinkURL={actor.html_url || ''}
              username={actor.display_login || actor.login}
            /> */}

            <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
              {/* <Spacer width={leftColumnBigSize - leftColumnSmallSize} /> */}

              <View style={sharedStyles.flex}>{Content}</View>

              <Spacer width={contentPadding / 3} />
            </View>
          </View>
        </View>
      </SpringAnimatedView>
    )
  },
)
