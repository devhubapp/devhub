import { MomentInput } from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { IGitHubIcon } from '../../../types'
import { getDateSmallText } from '../../../utils/helpers/shared'
import Avatar from '../../common/Avatar'
import IntervalRefresh from '../../common/IntervalRefresh'
import Label from '../../common/Label'
import { ThemeConsumer } from '../../context/ThemeContext'
import { UserConsumer } from '../../context/UserContext'
import { getCardStylesForTheme } from '../styles'
import CardIcon from './CardIcon'

export interface IProps {
  cardIconColor: string
  cardIconName: IGitHubIcon
  isPrivate?: boolean
  isRead: boolean
  labelColor: string
  labelText: string
  updatedAt: MomentInput
}

export interface IState {}

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

export class NotificationCardHeader extends PureComponent<IProps> {
  render() {
    const {
      cardIconColor,
      cardIconName,
      isPrivate,
      isRead,
      labelColor,
      labelText,
      updatedAt,
    } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View style={styles.container}>
            <View style={getCardStylesForTheme(theme).leftColumn}>
              <UserConsumer>
                {({ user }) => (
                  <Avatar
                    shape="circle"
                    small
                    style={getCardStylesForTheme(theme).avatar}
                    username={(user && user.login) || ''}
                  />
                )}
              </UserConsumer>
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
