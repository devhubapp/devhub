import { MomentInput } from 'moment'
import React from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { getDateSmallText, GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../../hooks/use-animated-theme'
import * as actions from '../../../redux/actions'
import { useReduxAction } from '../../../redux/hooks/use-redux-action'
import { useReduxState } from '../../../redux/hooks/use-redux-state'
import * as selectors from '../../../redux/selectors'
import * as colors from '../../../styles/colors'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Label } from '../../common/Label'
import { getCardStylesForTheme } from '../styles'
import { CardIcon } from './CardIcon'

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
    flexGrow: 1,
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
  const theme = useAnimatedTheme()

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
      <View
        style={[
          getCardStylesForTheme(theme).leftColumn,
          smallLeftColumn
            ? getCardStylesForTheme(theme).leftColumn__small
            : getCardStylesForTheme(theme).leftColumn__big,
        ]}
      >
        <Avatar
          shape="circle"
          small
          style={getCardStylesForTheme(theme).avatar}
          username={username}
        />
      </View>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View style={getCardStylesForTheme(theme).horizontal}>
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
                      <Animated.Text
                        numberOfLines={1}
                        style={getCardStylesForTheme(theme).timestampText}
                      >
                        {`• ${dateText}`}
                      </Animated.Text>
                    </>
                  )
                }}
              </IntervalRefresh>
            </View>
          </View>

          <CardIcon
            name="bookmark"
            color={
              isSaved
                ? colors.brandBackgroundColor
                : theme.foregroundColorMuted50
            }
            onPress={() => saveItemsForLater({ itemIds: ids, save: !isSaved })}
          />
          <CardIcon name={cardIconName} color={cardIconColor} />
        </View>
      </View>
    </View>
  )
}
