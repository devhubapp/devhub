import React from 'react'

import { sharedStyles } from '../../styles/shared'
import {
  contentPadding,
  scaleFactor,
  smallTextSize,
} from '../../styles/variables'
import {
  ThemedTextInput,
  ThemedTextInputProps,
} from '../themed/ThemedTextInput'
import { ThemedView, ThemedViewProps } from '../themed/ThemedView'

export interface SearchBarProps extends ThemedTextInputProps {
  containerBackgroundThemeColor?: ThemedViewProps['backgroundColor']
  noPaddingHorizontal?: boolean
  noPaddingVertical?: boolean
}

export const searchBarOuterSpacing = contentPadding / 2
export const searchBarMainContentHeight = 36 * scaleFactor
export const searchBarTotalHeight =
  searchBarMainContentHeight + searchBarOuterSpacing * 2

export const SearchBar = React.memo(
  React.forwardRef((props: SearchBarProps, ref) => {
    const {
      backgroundFocusThemeColor,
      backgroundHoverThemeColor,
      backgroundThemeColor,
      borderFocusThemeColor = 'backgroundColorDarker2',
      borderHoverThemeColor,
      borderThemeColor,
      containerBackgroundThemeColor = 'backgroundColorLighther1',
      fontSize = smallTextSize,
      noPaddingHorizontal,
      noPaddingVertical,
      placeholder = 'Search',
      placeholderTextThemeColor,
      size = searchBarMainContentHeight,
      textFocusThemeColor,
      textHoverThemeColor,
      textThemeColor,
      ...otherProps
    } = props

    return (
      <ThemedView
        backgroundColor={containerBackgroundThemeColor}
        style={[
          sharedStyles.flex,
          !noPaddingVertical && { paddingVertical: searchBarOuterSpacing },
          !noPaddingHorizontal && { paddingHorizontal: searchBarOuterSpacing },
        ]}
      >
        <ThemedTextInput
          key={`search-bar-${otherProps.textInputKey}`}
          ref={ref as any}
          backgroundFocusThemeColor={backgroundFocusThemeColor}
          backgroundHoverThemeColor={backgroundHoverThemeColor}
          backgroundThemeColor={backgroundThemeColor}
          borderFocusThemeColor={borderFocusThemeColor}
          borderHoverThemeColor={borderHoverThemeColor}
          borderThemeColor={borderThemeColor}
          fontSize={fontSize}
          placeholder={placeholder}
          placeholderTextThemeColor={placeholderTextThemeColor}
          size={size}
          textFocusThemeColor={textFocusThemeColor}
          textHoverThemeColor={textHoverThemeColor}
          textThemeColor={textThemeColor}
          {...otherProps}
        />
      </ThemedView>
    )
  }),
)

SearchBar.displayName = 'SearchBar'
