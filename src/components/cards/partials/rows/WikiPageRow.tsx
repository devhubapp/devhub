import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import cardStyles from '../../styles'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface WikiPageRowProps {
  isRead: boolean
  name?: string
  showMoreItemsIndicator?: boolean
  title: string
  url: string
}

export interface WikiPageRowState {}

const WikiPageRow: SFC<WikiPageRowProps> = ({
  isRead,
  name,
  showMoreItemsIndicator,
  title: _title,
  url,
}) => {
  const title = trimNewLinesAndSpaces(_title || name)
  if (!title) return null

  return (
    <View style={rowStyles.container}>
      <View style={cardStyles.leftColumn} />

      <View style={cardStyles.rightColumn}>
        <TouchableOpacity
          onPress={
            showMoreItemsIndicator ? undefined : getGithubURLPressHandler(url)
          }
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
          >
            <Icon name="book" /> {showMoreItemsIndicator ? '' : title}
            {!!showMoreItemsIndicator && (
              <Text
                numberOfLines={1}
                style={[cardStyles.normalText, cardStyles.mutedText]}
              >
                ...
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WikiPageRow
