import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { IGitHubIcon } from '../../../types/index'
import Label from '../../common/Label'
import cardStyles from '../styles'
import CardIcon from './CardIcon'

export interface IProps {
  cardIconColor: string
  cardIconName: IGitHubIcon
  isPrivate?: boolean
  isRead?: boolean
  labelColor: string
  labelText: string
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
    const {
      cardIconColor,
      cardIconName,
      isPrivate,
      isRead,
      labelColor,
      labelText,
    } = this.props

    return (
      <View style={styles.container}>
        <View style={cardStyles.leftColumn} />

        <View style={styles.rightColumnCentered}>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={cardStyles.horizontal}>
                <Label
                  color={labelColor}
                  isPrivate={isPrivate}
                  numberOfLines={1}
                  // outline={isRead}
                  outline
                >
                  {labelText}
                </Label>
                <Text style={cardStyles.timestampText}>
                  &nbsp;•&nbsp;2h (13:59)
                </Text>
              </View>
            </View>

            <CardIcon name={cardIconName} color={cardIconColor} />
          </View>
        </View>
      </View>
    )
  }
}
