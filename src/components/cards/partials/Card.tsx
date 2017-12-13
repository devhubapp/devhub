import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../../styles/themes/light'
import { contentPadding } from '../../../styles/variables'
import CardHeader, { IProps as ICardHeaderProps } from './CardHeader'
import RepositoryRow from './rows/RepositoryRow'

export interface IProps extends ICardHeaderProps {}

export interface IState {}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    paddingHorizontal: contentPadding,
    paddingVertical: 2 * contentPadding,
  } as ViewStyle,
})

const Card = ({ username }: IProps) => (
  <View style={styles.container}>
    <CardHeader username={username} />
    <RepositoryRow owner="facebook" repository="react-native" />
  </View>
)

export default Card
