import React from 'react'
import { View, ViewProps } from 'react-native'

import { GitHubLabel } from '@devhub/core'
import { contentPadding } from '../../../../styles/variables'
import { Label } from '../../../common/Label'

export interface LabelsViewProps {
  labels: Array<{
    key: string
    name: GitHubLabel['name']
    color: GitHubLabel['color']
  }>
  muted?: boolean
  style?: ViewProps['style']
}

export const LabelsView = (props: LabelsViewProps) => {
  const { labels, muted, style } = props

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: -contentPadding / 5,
        },
        style,
      ]}
    >
      {labels.map(label => (
        <Label
          key={label.key}
          color={label.color}
          containerStyle={{
            alignSelf: 'flex-start',
            margin: contentPadding / 5,
          }}
          muted={muted}
          outline={false}
          small
        >
          {label.name.toLowerCase()}
        </Label>
      ))}
    </View>
  )
}
