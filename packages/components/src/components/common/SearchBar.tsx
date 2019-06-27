import React from 'react'

import { contentPadding, smallTextSize } from '../../styles/variables'
import { separatorSize } from '../common/Separator'
import {
  ThemedTextInput,
  ThemedTextInputProps,
} from '../themed/ThemedTextInput'
import { ThemedView } from '../themed/ThemedView'

export interface SearchBarProps extends ThemedTextInputProps {}

export const searchBarTotalHeight =
  30 + (contentPadding / 2) * 2 + separatorSize

export const SearchBar = React.memo(
  React.forwardRef((props: SearchBarProps, ref) => {
    const {
      backgroundFocusThemeColor = 'backgroundColorLighther2',
      backgroundHoverThemeColor = 'backgroundColorLighther1',
      backgroundThemeColor = 'backgroundColor',
      borderFocusThemeColor = 'backgroundColorLighther2',
      borderHoverThemeColor = 'backgroundColorLighther1',
      borderThemeColor = 'backgroundColor',
      fontSize = smallTextSize,
      placeholder = 'Search',
      placeholderTextThemeColor = 'foregroundColorMuted40',
      size = 30,
      textFocusThemeColor = 'foregroundColor',
      textHoverThemeColor = 'foregroundColorMuted60',
      textThemeColor = 'foregroundColorMuted60',
      ...otherProps
    } = props

    return (
      <ThemedView
        backgroundColor="backgroundColorDarker1"
        style={{ padding: contentPadding / 2 }}
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
