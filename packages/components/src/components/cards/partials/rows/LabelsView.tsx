import React, { Fragment, useEffect, useRef } from 'react'
import { ScrollView, ViewProps } from 'react-native'

import { GitHubLabel } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { hiddenLabelSize, Label, LabelProps } from '../../../common/Label'
import { TouchableOpacity } from '../../../common/TouchableOpacity'

export interface LabelsViewProps
  extends Omit<LabelProps, 'children' | 'color' | 'containerStyle'> {
  enableScrollView?: boolean
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
  const {
    enableScrollView,
    fragment,
    hideText,
    labels,
    style,
    ...otherProps
  } = props

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (!scrollViewRef.current) return
    scrollViewRef.current.scrollToEnd({ animated: false })
  }, [scrollViewRef.current])

  const horizontalSpacing = hideText
    ? -hiddenLabelSize.width / 8
    : contentPadding / 3
  const verticalSpacing = 1

  const texts = labels
    .map(label => label && label.name)
    .filter(text => !!text && typeof text === 'string')

  const tooltip = hideText
    ? texts.length === 1
      ? `Label: ${texts[0]}`
      : texts.length > 1
      ? `Labels:\n${texts.join('\n')}`
      : ''
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
              {
                flexWrap: enableScrollView ? 'nowrap' : 'wrap',
                maxWidth: '100%',
                marginHorizontal: -horizontalSpacing,
                marginVertical: -verticalSpacing,
              },
              style,
            ]}
            tooltip={tooltip}
          >
            <ConditionalWrap
              condition={!!enableScrollView}
              wrap={c => (
                <ScrollView ref={scrollViewRef} horizontal>
                  {c}
                </ScrollView>
              )}
            >
              {children}
            </ConditionalWrap>
          </TouchableOpacity>
        )
      }
    >
      {labels.map(label => (
        <Label
          key={label.key}
          colorThemeColor={label.color}
          containerStyle={{
            alignSelf: 'flex-start',
            paddingHorizontal: horizontalSpacing,
            paddingVertical: verticalSpacing,
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
