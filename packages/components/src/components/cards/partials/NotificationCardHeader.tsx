import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { getDateSmallText, GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../../hooks/use-redux-action'
import { useReduxState } from '../../../hooks/use-redux-state'
import * as actions from '../../../redux/actions'
import * as selectors from '../../../redux/selectors'
import * as colors from '../../../styles/colors'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../../animated/spring/SpringAnimatedView'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Label } from '../../common/Label'
import { cardStyles, getCardStylesForTheme } from '../styles'
import { SpringAnimatedCardIcon } from './CardIcon'

export interface NotificationCardHeaderProps {
  cardIconColor?: string
  cardIconName: GitHubIcon
  ids: Array<string | number>
  isPrivate?: boolean
  isRead: boolean
  isSaved?: boolean
  labelColor: string
  labelText: string
  smallLeftColumn?: boolean
  updatedAt: MomentInput
}

export interface NotificationCardHeaderState {}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  rightColumnCentered: {
    flex: 1,
    justifyContent: 'center',
  },

  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  innerContainer: {
    flex: 1,
  },
})

export function NotificationCardHeader(props: NotificationCardHeaderProps) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const username = useReduxState(selectors.currentUsernameSelector)
  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  const {
    cardIconColor,
    cardIconName,
    ids,
    isPrivate,
    isRead,
    isSaved,
    labelColor,
    labelText,
    smallLeftColumn,
    updatedAt,
  } = props

  return (
    <View
      key={`notification-card-header-${ids.join(',')}-inner`}
      style={styles.container}
    >
      <SpringAnimatedView
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
        ]}
      >
        <Avatar
          shape="circle"
          small
          style={cardStyles.avatar}
          username={username}
        />
      </SpringAnimatedView>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <SpringAnimatedView style={cardStyles.horizontal}>
              <Label
                color={labelColor}
                isPrivate={isPrivate}
                outline={isRead}
                textProps={{ numberOfLines: 1 }}
              >
                {labelText}
              </Label>
              <IntervalRefresh date={updatedAt}>
                {() => {
                  const dateText = getDateSmallText(updatedAt)
                  if (!dateText) return null

                  return (
                    <>
                      <Text children=" " />
                      <SpringAnimatedText
                        numberOfLines={1}
                        style={
                          getCardStylesForTheme(springAnimatedTheme)
                            .timestampText
                        }
                      >
                        {`• ${dateText}`}
                      </SpringAnimatedText>
                    </>
                  )
                }}
              </IntervalRefresh>
            </SpringAnimatedView>
          </View>

          <SpringAnimatedCardIcon
            name="bookmark"
            onPress={() => saveItemsForLater({ itemIds: ids, save: !isSaved })}
            style={{
              color: isSaved
                ? colors.brandBackgroundColor
                : springAnimatedTheme.foregroundColorMuted50,
            }}
          />
          <SpringAnimatedCardIcon
            name={cardIconName}
            style={!!cardIconColor && { color: cardIconColor }}
          />
        </View>
      </View>
    </View>
  )
}
