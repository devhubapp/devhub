import { MomentInput } from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'

import * as selectors from '../../../redux/selectors'
import { ExtractPropsFromConnector, GitHubIcon } from '../../../types'
import { getDateSmallText } from '../../../utils/helpers/shared'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Label } from '../../common/Label'
import { ThemeConsumer } from '../../context/ThemeContext'
import { getCardStylesForTheme } from '../styles'
import { CardIcon } from './CardIcon'

export interface NotificationCardHeaderProps {
  cardIconColor: string
  cardIconName: GitHubIcon
  isPrivate?: boolean
  isRead: boolean
  labelColor: string
  labelText: string
  updatedAt: MomentInput
}

export interface NotificationCardHeaderState {}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  } as ViewStyle,

  rightColumnCentered: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,

  innerContainer: {
    flex: 1,
  } as ViewStyle,
})

const connectToStore = connect((state: any) => {
  const user = selectors.currentUserSelector(state)

  return {
    username: (user && user.login) || '',
  }
})

class NotificationCardHeaderComponent extends PureComponent<
  NotificationCardHeaderProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    const {
      cardIconColor,
      cardIconName,
      isPrivate,
      isRead,
      labelColor,
      labelText,
      updatedAt,
      username,
    } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View style={styles.container}>
            <View style={getCardStylesForTheme(theme).leftColumn}>
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
                          <Text
                            style={getCardStylesForTheme(theme).timestampText}
                          >
                            {` • ${dateText}`}
                          </Text>
                        )
                      }}
                    </IntervalRefresh>
                  </View>
                </View>

                <CardIcon name={cardIconName} color={cardIconColor} />
              </View>
            </View>
          </View>
        )}
      </ThemeConsumer>
    )
  }
}

export const NotificationCardHeader = connectToStore(
  NotificationCardHeaderComponent,
)
