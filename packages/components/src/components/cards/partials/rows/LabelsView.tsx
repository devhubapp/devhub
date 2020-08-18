import React, { Fragment, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, ViewProps } from 'react-native'

import { GitHubLabel, Theme, ThemeColors } from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding } from '../../../../styles/variables'
import { fixColorHexWithoutHash } from '../../../../utils/helpers/colors'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { Label, LabelProps } from '../../../common/Label'
import { ScrollViewWithOverlay } from '../../../common/ScrollViewWithOverlay'
import { TouchableOpacity } from '../../../common/TouchableOpacity'

export interface LabelsViewProps
  extends Omit<LabelProps, 'children' | 'color' | 'containerStyle'> {
  backgroundThemeColor: keyof ThemeColors | ((theme: Theme) => string)
  enableScrollView?: boolean
  enableScrollViewOverlay?: boolean
  fragment?: boolean
  labels: {
    key?: string
    name: GitHubLabel['name']
    color?: GitHubLabel['color']
  }[]
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

  const horizontalSpacing = contentPadding / 3
  const verticalSpacing = 1

  return (
    <ConditionalWrap
      condition
      wrap={(children) =>
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
          >
            <ConditionalWrap
              condition={!!enableScrollView}
              wrap={(c) =>
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
      {labels.map((label) => (
        <Label
          key={label.key || label.name}
          colorThemeColor={fixColorHexWithoutHash(label.color)}
          containerStyle={[
            sharedStyles.alignSelfFlexStart,
            {
              paddingHorizontal: horizontalSpacing,
              paddingVertical: verticalSpacing,
            },
          ]}
          disableEmojis
          small
          {...otherProps}
        >
          {label.name.toLowerCase()}
        </Label>
      ))}
    </ConditionalWrap>
  )
}

LabelsView.displayName = 'LabelsView'
