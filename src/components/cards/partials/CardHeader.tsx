import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import Avatar from '../../common/Avatar'
import cardStyles from '../styles'
import CardIcon from './CardIcon'

export interface IProps {
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

const CardHeader = ({ username }: IProps) => (
  <View style={styles.container}>
    <View style={cardStyles.leftColumn}>
      <Avatar username={username} style={cardStyles.avatar} />
    </View>

    <View style={styles.rightColumnCentered}>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={cardStyles.horizontal}>
            <Text style={cardStyles.usernameText}>{username}</Text>
            <Text style={cardStyles.timestampText}>&nbsp;•&nbsp;2h (13:59)</Text>
          </View>

          <Text style={cardStyles.descriptionText}>starred a repository</Text>
        </View>

        <CardIcon name="star" color="#FFC107" />
      </View>
    </View>
  </View>
)

export default CardHeader
