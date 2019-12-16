import React, { Fragment, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, ViewProps } from 'react-native'

import { GitHubLabel, Theme, ThemeColors } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { hiddenLabelSizes, Label, LabelProps } from '../../../common/Label'
import { ScrollViewWithOverlay } from '../../../common/ScrollViewWithOverlay'
import { TouchableOpacity } from '../../../common/TouchableOpacity'

export interface LabelsViewProps
  extends Omit<LabelProps, 'children' | 'color' | 'containerStyle'> {
  backgroundThemeColor: keyof ThemeColors | ((theme: Theme) => string)
  enableScrollView?: boolean
  enableScrollViewOverlay?: boolean
  fragment?: boolean
  hideText?: boolean
  labels: Array<{
    key?: string
    name: GitHubLabel['name']
    color?: GitHubLabel['color']
  }>
  startScrollAtEnd?: boolean
  style?: ViewProps['style']
}

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
  },
})

export const LabelsView = (props: LabelsViewProps) => {
  const {
    backgroundThemeColor,
    enableScrollView,
    enableScrollViewOverlay,
    fragment,
    hideText,
    labels,
    startScrollAtEnd,
    style,
    ...otherProps
  } = props

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (!startScrollAtEnd) return
    if (!scrollViewRef.current) return

    scrollViewRef.current.scrollToEnd({ animated: false })
  }, [scrollViewRef.current, startScrollAtEnd])

  const horizontalSpacing = hideText
    ? -hiddenLabelSizes.width / 8
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
              styles.touchable,
              enableScrollView
                ? sharedStyles.flexNoWrap
                : sharedStyles.flexWrap,
              {
                backgroundColor: 'blue',
                marginHorizontal: -horizontalSpacing,
                marginVertical: -verticalSpacing,
              },
              style,
            ]}
            tooltip={tooltip}
          >
            <ConditionalWrap
              condition={!!enableScrollView}
              wrap={c =>
                enableScrollViewOverlay ? (
                  <ScrollViewWithOverlay
                    ref={scrollViewRef}
                    alwaysBounceHorizontal={false}
                    alwaysBounceVertical={false}
                    bottomOrRightOverlayThemeColor={backgroundThemeColor}
                    containerStyle={style}
                    data-scrollbar={false}
                    horizontal
                    topOrLeftOverlayThemeColor={backgroundThemeColor}
                  >
                    {c}
                  </ScrollViewWithOverlay>
                ) : (
                  <ScrollView
                    ref={scrollViewRef}
                    alwaysBounceHorizontal={false}
                    alwaysBounceVertical={false}
                    data-scrollbar={false}
                    horizontal
                    style={style}
                  >
                    {c}
                  </ScrollView>
                )
              }
            >
              {children}
            </ConditionalWrap>
          </TouchableOpacity>
        )
      }
    >
      {labels.map(label => (
        <Label
          key={label.key || label.name}
          backgroundThemeColor={backgroundThemeColor}
          colorThemeColor={label.color}
          containerStyle={[
            sharedStyles.alignSelfFlexStart,
            {
              paddingHorizontal: horizontalSpacing,
              paddingVertical: verticalSpacing,
            },
          ]}
          disableEmojis
          hideText={hideText}
          outline={false}
          small
          transparent
          {...otherProps}
        >
          {hideText && !fragment ? '' : label.name.toLowerCase()}
        </Label>
      ))}
    </ConditionalWrap>
  )
}

LabelsView.displayName = 'LabelsView'
