import React, { Fragment } from 'react'
import { ViewProps } from 'react-native'

import { GitHubLabel, Omit } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { hiddenLabelSize, Label, LabelProps } from '../../../common/Label'
import { TouchableOpacity } from '../../../common/TouchableOpacity'

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
  const { fragment, hideText, labels, style, ...otherProps } = props

  const horizontalSpacing = hideText
    ? -hiddenLabelSize.width / 8
    : contentPadding / 8
  const verticalSpacing = contentPadding / 8

  const texts = labels
    .map(label => label && label.name)
    .filter(text => !!text && typeof text === 'string')

  const tooltip =
    texts.length === 1
      ? `Label: ${texts[0]}`
      : texts.length > 1
      ? `Labels:\n${texts.join('\n')}`
      : ''

  return (
    <ConditionalWrap
      condition
      wrap={children =>
        fragment ? (
          <Fragment>{children}</Fragment>
        ) : (
          <TouchableOpacity
            style={[
              sharedStyles.horizontalAndVerticallyAligned,
              sharedStyles.flexWrap,
              {
                maxWidth: '100%',
                marginHorizontal: -horizontalSpacing,
                marginVertical: -verticalSpacing,
              },
              style,
            ]}
            tooltip={tooltip}
          >
            {children}
          </TouchableOpacity>
        )
      }
    >
      {labels.map(label => (
        <Label
          key={label.key}
          color={label.color}
          containerStyle={{
            alignSelf: 'flex-start',
            marginHorizontal: horizontalSpacing,
            marginVertical: verticalSpacing,
          }}
          hideText={hideText}
          outline={false}
          small
          {...otherProps}
        >
          {hideText && !fragment ? '' : label.name.toLowerCase()}
        </Label>
      ))}
    </ConditionalWrap>
  )
}
