import React, { Fragment } from 'react'
import { PixelRatio, StyleSheet, Text, View } from 'react-native'

import { getDateSmallText, getFullDateText, Theme } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  avatarSize,
  normalTextSize,
  smallAvatarSize,
  smallerTextSize,
} from '../../styles/variables'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Avatar } from '../common/Avatar'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { BaseCardProps, sizes } from './BaseCard.shared'
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
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: sizes.iconContainerSize,
    height: sizes.iconContainerSize,
    borderRadius: sizes.iconContainerSize / 2,
    borderWidth: 2,
  },

  iconContainer__bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: -sizes.iconContainerSize / 2,
  },

  iconContainer__bottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  icon: {
    marginTop: StyleSheet.hairlineWidth,
    fontSize: PixelRatio.roundToNearestPixel(
      sizes.iconContainerSize * (14 / sizes.iconContainerSize),
    ),
    fontWeight: 'bold',
    textAlign: 'center',
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
    icon,
    id,
    isPrivate,
    isRead,
    link,
    subitems,
    subtitle,
    text,
    title,
    type,
  } = props

  if (!link) console.error(`No link for ${type} card: ${id}, ${title}, ${text}`)
  if (link && link.includes('api.github.com'))
    console.error(`Wrong link for ${type} card: ${id}, ${title}, ${text}`, link)

  const backgroundThemeColor = (theme: Theme) =>
    getCardBackgroundThemeColor({ isDark: theme.isDark, isMuted: isRead })

  return (
    <View
      key={`base-card-container-${type}-${id}-inner`}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {!!(action && action.text) && (
          <>
            <View style={styles.actionContainer}>
              <View style={styles.smallAvatarContainer}>
                <Avatar
                  avatarUrl={action.avatar.imageURL}
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
              linkURL={avatar.linkURL}
              style={styles.avatar}
              size={avatarSize}
            />

            <ThemedView
              backgroundColor={backgroundThemeColor}
              borderColor={backgroundThemeColor}
              style={[styles.iconContainer, styles.iconContainer__bottomRight]}
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

          <View style={sharedStyles.flex}>
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

            {!!text && (
              <ThemedText
                color="foregroundColorMuted65"
                numberOfLines={1}
                style={styles.text}
              >
                {!!isPrivate && (
                  <>
                    <ThemedIcon name="lock" />{' '}
                  </>
                )}
                {text}
              </ThemedText>
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
    </View>
  )
})

BaseCard.displayName = 'BaseCard'
