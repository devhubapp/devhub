import { getDateSmallText, getFullDateText, Theme } from '@devhub/core'
import React, { Fragment, useContext } from 'react'
import { PixelRatio, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import {
  avatarSize,
  normalTextSize,
  smallAvatarSize,
  smallerTextSize,
} from '../../styles/variables'
import { KeyboardKeyIsPressed } from '../AppKeyboardShortcuts'
import { CurrentColumnContext } from '../columns/Column'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Avatar } from '../common/Avatar'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { BaseCardProps, sizes } from './BaseCard.shared'
import {
  CardItemSeparator,
  cardItemSeparatorSize,
} from './partials/CardItemSeparator'
import { InstallGitHubAppText } from './partials/rows/InstallGitHubAppText'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  innerContainer: {
    width: '100%',
    height: '100%',
    padding: sizes.cardPadding,
  },

  smallAvatarContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    width: sizes.avatarContainerWidth,
    height: smallAvatarSize,
    paddingRight: sizes.avatarContainerWidth - avatarSize - smallAvatarSize / 2,
  },

  avatarContainer: {
    position: 'relative',
    width: sizes.avatarContainerWidth,
    height: sizes.avatarContainerHeight,
  },

  avatar: {},

  iconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: sizes.iconContainerSize,
    height: sizes.iconContainerSize,
    borderRadius: sizes.iconContainerSize / 2,
    borderWidth: 2,
  },

  icon: {
    marginTop: StyleSheet.hairlineWidth,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: PixelRatio.roundToNearestPixel(
      sizes.iconContainerSize * (sizes.iconSize / sizes.iconContainerSize),
    ),
  },

  title: {
    flex: 1,
    lineHeight: sizes.rightTextLineHeight,
    fontSize: normalTextSize,
    fontWeight: '500',
    overflow: 'hidden',
  },

  subtitle: {
    flexGrow: 1,
    lineHeight: sizes.rightTextLineHeight,
    fontSize: smallerTextSize,
    fontWeight: '400',
    overflow: 'hidden',
  },

  text: {
    flexGrow: 1,
    lineHeight: sizes.rightTextLineHeight,
    fontSize: smallerTextSize,
    fontWeight: '300',
    overflow: 'hidden',
  },

  reason: {
    lineHeight: sizes.rightTextLineHeight,
    fontSize: smallerTextSize,
    fontWeight: '300',
    textAlign: 'right',
  },

  timestampText: {
    lineHeight: sizes.rightTextLineHeight,
    fontSize: smallerTextSize,
    fontWeight: '300',
    overflow: 'hidden',
    ...Platform.select({ web: { fontFeatureSettings: '"tnum"' } }),
  },

  actionContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: sizes.actionContainerHeight,
  },

  action: {
    flex: 1,
    lineHeight: sizes.actionFontSize + 2,
    fontSize: sizes.actionFontSize,
    fontWeight: '300',
    overflow: 'hidden',
  },

  subitemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: sizes.subitemContainerHeight,
  },

  subitem: {
    flex: 1,
    maxWidth: '100%',
    lineHeight: sizes.subitemLineHeight,
    fontSize: sizes.subitemFontSize,
    fontWeight: '400',
    overflow: 'hidden',
  },

  githubAppMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: sizes.githubAppMessageContainerHeight,
  },

  githubAppMessage: {
    flex: 1,
    maxWidth: '100%',
    lineHeight: sizes.rightTextLineHeight,
    fontSize: smallerTextSize,
    fontWeight: '300',
    fontStyle: 'italic',
    overflow: 'hidden',
  },
})

export const BaseCard = React.memo((props: BaseCardProps) => {
  const {
    action,
    avatar,
    date,
    githubApp,
    height,
    icon,
    id,
    isRead,
    link,
    reason,
    showPrivateLock,
    subitems,
    subtitle,
    text,
    title,
    type,
  } = props

  if (!link)
    console.error(
      `No link for ${type} card: ${id}, ${title}, ${text && text.text}`,
    )
  if (link && link.includes('api.github.com'))
    console.error(
      `Wrong link for ${type} card: ${id}, ${title}, ${text && text.text}`,
      link,
    )

  const backgroundThemeColor = (theme: Theme) =>
    getCardBackgroundThemeColor({ isDark: theme.isDark, isMuted: isRead })

  const dispatch = useDispatch()
  const columnId = useContext(CurrentColumnContext)

  return (
    <View
      key={`base-card-container-${type}-${id}-inner`}
      style={[styles.container, { height }]}
    >
      <View
        style={[
          styles.innerContainer,
          { height: height - cardItemSeparatorSize },
        ]}
      >
        {!!(action && action.text) && (
          <>
            <View style={styles.actionContainer}>
              <View style={styles.smallAvatarContainer}>
                <Avatar
                  avatarUrl={action.avatar.imageURL}
                  disableLink={action.avatar.linkURL === link}
                  linkURL={action.avatar.linkURL}
                  style={styles.avatar}
                  size={smallAvatarSize}
                />
              </View>

              <Spacer width={sizes.horizontalSpaceSize} />

              <ThemedText
                color="foregroundColorMuted65"
                numberOfLines={1}
                style={styles.action}
              >
                {action.text}
              </ThemedText>
            </View>

            <Spacer height={sizes.verticalSpaceSize} />
          </>
        )}

        <View style={sharedStyles.horizontal}>
          <View style={styles.avatarContainer}>
            <Avatar
              avatarUrl={avatar.imageURL}
              disableLink={avatar.linkURL === link}
              linkURL={avatar.linkURL}
              style={styles.avatar}
              size={avatarSize}
            />

            <ThemedView
              backgroundColor={backgroundThemeColor}
              borderColor={backgroundThemeColor}
              style={styles.iconContainer}
            >
              <ThemedIcon
                name={icon.name}
                color={
                  icon.color ||
                  (isRead ? 'foregroundColorMuted65' : 'foregroundColor')
                }
                style={styles.icon}
              />
            </ThemedView>
          </View>

          <Spacer width={sizes.horizontalSpaceSize} />

          <View style={[sharedStyles.flex, sharedStyles.alignSelfCenter]}>
            <Spacer height={sizes.rightInnerTopSpacing} />

            <View style={sharedStyles.horizontalAndVerticallyAligned}>
              <ThemedText
                color={isRead ? 'foregroundColorMuted65' : 'foregroundColor'}
                numberOfLines={1}
                style={styles.title}
              >
                {title}
              </ThemedText>

              <IntervalRefresh date={date}>
                {() => {
                  const dateText = getDateSmallText(date, false)
                  if (!dateText) return null

                  return (
                    <>
                      <Text children="  " />
                      <ThemedText
                        color="foregroundColorMuted65"
                        numberOfLines={1}
                        style={styles.timestampText}
                        {...Platform.select({
                          web: { title: getFullDateText(date) },
                        })}
                      >
                        {dateText}
                      </ThemedText>

                      {!!showPrivateLock && (
                        <>
                          <Text children="  " />
                          <ThemedIcon
                            name="lock"
                            color="foregroundColorMuted65"
                          />
                        </>
                      )}
                    </>
                  )
                }}
              </IntervalRefresh>
            </View>

            {!!subtitle && (
              <ThemedText
                color={isRead ? 'foregroundColorMuted65' : 'foregroundColor'}
                numberOfLines={1}
                style={styles.subtitle}
              >
                {subtitle}
              </ThemedText>
            )}

            {!!(text && text.text) && (
              <View
                style={[
                  sharedStyles.horizontalAndVerticallyAligned,
                  sharedStyles.justifyContentSpaceBetween,
                  sharedStyles.fullWidth,
                  sharedStyles.fullMaxWidth,
                  { height: sizes.rightTextLineHeight },
                ]}
              >
                {text.repo && text.repo.owner && text.repo.name && columnId ? (
                  <Link
                    enableUnderlineHover
                    href="javascript:void(0)"
                    openOnNewTab={false}
                    onPress={() => {
                      const issueNumber =
                        !!(
                          text &&
                          text.text &&
                          text.text.match(/^#([0-9]+)$/)
                        ) && Number(text.text.match(/^#([0-9]+)$/)![1])

                      const removeIfAlreadySet = !(
                        KeyboardKeyIsPressed.meta || KeyboardKeyIsPressed.shift
                      )

                      const removeOthers = !(
                        KeyboardKeyIsPressed.alt ||
                        KeyboardKeyIsPressed.meta ||
                        KeyboardKeyIsPressed.shift
                      )

                      if (issueNumber) {
                        dispatch(
                          actions.changeIssueNumberFilter({
                            columnId,
                            issueNumber,
                            removeIfAlreadySet,
                            removeOthers,
                            value: KeyboardKeyIsPressed.alt ? false : true,
                          }),
                        )
                        return
                      }

                      dispatch(
                        actions.setColumnRepoFilter({
                          columnId,
                          owner: text!.repo!.owner,
                          repo: text!.repo!.name,
                          value: KeyboardKeyIsPressed.alt ? false : true,
                          // removeIfAlreadySet,
                          // removeOthers,
                        }),
                      )
                    }}
                    textProps={{
                      color: 'foregroundColorMuted65',
                      numberOfLines: 1,
                      style: styles.text,
                    }}
                  >
                    {text.text}
                  </Link>
                ) : (
                  <ThemedText
                    color="foregroundColorMuted65"
                    numberOfLines={1}
                    style={styles.text}
                  >
                    {text.text}
                  </ThemedText>
                )}

                {!!(reason && reason.label && columnId) && (
                  <Link
                    enableUnderlineHover
                    href="javascript:void(0)"
                    openOnNewTab={false}
                    onPress={() => {
                      const removeIfAlreadySet = !(
                        KeyboardKeyIsPressed.meta || KeyboardKeyIsPressed.shift
                      )

                      const removeOthers = !(
                        KeyboardKeyIsPressed.alt ||
                        KeyboardKeyIsPressed.meta ||
                        KeyboardKeyIsPressed.shift
                      )

                      dispatch(
                        actions.setColumnReasonFilter({
                          columnId,
                          reason: reason.reason,
                          value: KeyboardKeyIsPressed.alt ? false : true,
                          removeIfAlreadySet,
                          removeOthers,
                        }),
                      )
                    }}
                    textProps={{
                      color: reason.color,
                      numberOfLines: 1,
                      style: [
                        styles.reason,
                        { minWidth: reason.label.length * 7 },
                      ],
                    }}
                    {...Platform.select({ web: { title: reason.tooltip } })}
                  >
                    {reason.label.toLowerCase()}
                  </Link>
                )}
              </View>
            )}
          </View>
        </View>

        {!!(subitems && subitems.length) &&
          subitems.map((subitem, index) => (
            <Fragment key={`base-card-subitem-${index}`}>
              <Spacer height={sizes.verticalSpaceSize} />

              <View style={styles.subitemContainer}>
                <View style={styles.smallAvatarContainer}>
                  {subitem.avatar && subitem.avatar.imageURL && (
                    <Avatar
                      avatarUrl={subitem.avatar.imageURL}
                      disableLink={subitem.avatar.linkURL === link}
                      linkURL={subitem.avatar.linkURL}
                      style={styles.avatar}
                      size={smallAvatarSize}
                    />
                  )}
                </View>

                <Spacer width={sizes.horizontalSpaceSize} />

                <ThemedText
                  color="foregroundColorMuted65"
                  numberOfLines={1}
                  style={styles.subitem}
                >
                  {subitem.text}
                </ThemedText>
              </View>
            </Fragment>
          ))}

        {!!githubApp && (
          <>
            <Spacer height={sizes.verticalSpaceSize} />

            <View style={styles.githubAppMessageContainer}>
              <Spacer
                width={sizes.avatarContainerWidth + sizes.horizontalSpaceSize}
              />

              <InstallGitHubAppText
                ownerId={githubApp.ownerId}
                repoId={githubApp.repoId}
                text={githubApp.text}
                textProps={{
                  color: 'foregroundColorMuted65',
                  numberOfLines: 1,
                  style: styles.githubAppMessage,
                }}
              />
            </View>
          </>
        )}
      </View>

      <CardItemSeparator muted={isRead} />
    </View>
  )
})

BaseCard.displayName = 'BaseCard'
