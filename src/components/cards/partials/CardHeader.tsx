import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import theme from '../../../styles/themes/dark'
import { IGitHubEvent } from '../../../types/index'
import { getEventIconAndColor, getEventText } from '../../../utils/helpers/github/events';
import Avatar from '../../common/Avatar'
import cardStyles from '../styles'
import CardIcon from './CardIcon'
import { getUserPressHandler } from './rows/helpers'

export interface IProps {
  event: IGitHubEvent
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

export default class CardHeader extends PureComponent<IProps> {
  render() {
    const { event } = this.props

    const cardIcon = getEventIconAndColor(event, theme)

    return (
      <View style={styles.container}>
        <View style={cardStyles.leftColumn}>
          <Avatar username={event.actor.login} style={cardStyles.avatar} />
        </View>

        <View style={styles.rightColumnCentered}>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={cardStyles.horizontal}>
                <TouchableOpacity onPress={getUserPressHandler(event.actor.login)}>
                  <Text style={cardStyles.usernameText}>{event.actor.login}</Text>
                </TouchableOpacity>
                <Text style={cardStyles.timestampText}>&nbsp;•&nbsp;2h (13:59)</Text>
              </View>

              <Text style={cardStyles.descriptionText}>{getEventText(event)}</Text>
            </View>

            <CardIcon name={cardIcon.icon} color={cardIcon.color || theme.base04} />
          </View>
        </View>
      </View>
    )
  }
}
