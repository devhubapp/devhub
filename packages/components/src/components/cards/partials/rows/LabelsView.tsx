import React, { Fragment } from 'react'
import { View, ViewProps } from 'react-native'

import { GitHubLabel, Omit } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { Label, LabelProps } from '../../../common/Label'

export interface LabelsViewProps
  extends Omit<LabelProps, 'children' | 'color' | 'containerStyle'> {
  fragment?: boolean
  hideText?: boolean
  labels: Array<{
    key: string
    name: GitHubLabel['name']
    color: GitHubLabel['color']
  }>
  style?: ViewProps['style']
}

export const LabelsView = (props: LabelsViewProps) => {
  const { fragment, labels, style, ...otherProps } = props

  return (
    <ConditionalWrap
      condition
      wrap={children =>
        fragment ? (
          <Fragment>{children}</Fragment>
        ) : (
          <View
            style={[
              sharedStyles.horizontalAndVerticallyAligned,
              sharedStyles.flexWrap,
              { maxWidth: '100%', marginHorizontal: -contentPadding / 5 },
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
          outline={false}
          small
          {...otherProps}
        >
          {label.name.toLowerCase()}
        </Label>
      ))}
    </ConditionalWrap>
  )
}
