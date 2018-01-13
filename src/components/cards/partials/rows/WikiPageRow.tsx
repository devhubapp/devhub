import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import cardStyles from '../../styles'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  isRead: boolean
  name?: string
  title: string
  url: string
}

export interface IState {}

const WikiPageRow: SFC<IProps> = ({ isRead, name, title: _title, url }) => {
  const title = trimNewLinesAndSpaces(_title || name)
  if (!title) return null

  return (
    <View style={rowStyles.container}>
      <View style={cardStyles.leftColumn} />

      <View style={cardStyles.rightColumn}>
        <TouchableOpacity
          onPress={getGithubURLPressHandler(url)}
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
          >
            <Icon name="book" /> {title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WikiPageRow
