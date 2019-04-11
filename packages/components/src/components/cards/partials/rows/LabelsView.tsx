import React, { Fragment } from 'react'
import { View, ViewProps } from 'react-native'

import { GitHubLabel } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { Label } from '../../../common/Label'

export interface LabelsViewProps {
  fragment?: boolean
  labels: Array<{
    key: string
    name: GitHubLabel['name']
    color: GitHubLabel['color']
  }>
  muted?: boolean
  style?: ViewProps['style']
}

export const LabelsView = (props: LabelsViewProps) => {
  const { fragment, labels, muted, style } = props

  return (
    <ConditionalWrap
      condition
      wrap={children =>
        fragment ? (
          <Fragment>{children}</Fragment>
        ) : (
          <View
            style={[
              sharedStyles.horizontal,
              sharedStyles.flexWrap,
              { marginHorizontal: -contentPadding / 5 },
              style,
            ]}
          >
            {children}
          </View>
        )
      }
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
    </ConditionalWrap>
  )
}
