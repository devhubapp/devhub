import React from 'react'
import { View } from 'react-native'

import { GitHubNotificationReason } from '@devhub/core'
import { getNotificationReasonMetadata } from '../../../../utils/helpers/github/notifications'
import { Label } from '../../../common/Label'
import { cardStyles } from '../../styles'
import { cardRowStyles } from './styles'

export interface NotificationReasonRowProps {
  isRead: boolean
  isPrivate: boolean
  reason: GitHubNotificationReason
  smallLeftColumn?: boolean
}

export const NotificationReasonRow = React.memo(
  (props: NotificationReasonRowProps) => {
    const { isPrivate, isRead, reason, smallLeftColumn } = props

    if (!reason) return null

    const labelDetails = getNotificationReasonMetadata(reason)
    const labelText = labelDetails.label.toLowerCase()
    const labelColor = labelDetails.color

    if (!labelText) return null

    return (
      <View style={cardRowStyles.container}>
        <View
          style={[
            cardStyles.leftColumn,
            smallLeftColumn
              ? cardStyles.leftColumn__small
              : cardStyles.leftColumn__big,
            cardStyles.leftColumnAlignTop,
          ]}
        />

        <View style={cardStyles.rightColumn}>
          <Label
            color={labelColor}
            containerStyle={{ alignSelf: 'flex-start' }}
            isPrivate={isPrivate}
            outline
            textProps={{ numberOfLines: 1 }}
          >
            {labelText}
          </Label>
        </View>
      </View>
    )
  },
)
