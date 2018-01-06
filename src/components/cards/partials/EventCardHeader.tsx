import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { IGitHubIcon } from '../../../types/index'
import Avatar from '../../common/Avatar'
import cardStyles from '../styles'
import CardIcon from './CardIcon'
import { getUserPressHandler } from './rows/helpers'

export interface IProps {
  actionText: string
  cardIconColor: string
  cardIconName: IGitHubIcon
  username: string
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

export default class EventCardHeader extends PureComponent<IProps> {
  render() {
    const { actionText, cardIconColor, cardIconName, username } = this.props

    return (
      <View style={styles.container}>
        <View style={cardStyles.leftColumn}>
          <Avatar username={username} style={cardStyles.avatar} />
        </View>

        <View style={styles.rightColumnCentered}>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={cardStyles.horizontal}>
                <TouchableOpacity onPress={getUserPressHandler(username)}>
                  <Text style={cardStyles.usernameText}>{username}</Text>
                </TouchableOpacity>
                <Text style={cardStyles.timestampText}>
                  &nbsp;•&nbsp;2h (13:59)
                </Text>
              </View>

              <Text style={cardStyles.descriptionText}>{actionText}</Text>
            </View>

            <CardIcon name={cardIconName} color={cardIconColor} />
          </View>
        </View>
      </View>
    )
  }
}
