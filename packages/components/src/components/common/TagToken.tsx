import React from 'react'
import { View } from 'react-native'

import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallTextSize } from '../../styles/variables'
import { Button } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { ThemedIcon, ThemedIconProps } from '../themed/ThemedIcon'
import { ThemedText, ThemedTextProps } from '../themed/ThemedText'

export type TagTokenProps = {
  onPress: () => void
  onRemove?: (() => void) | undefined
  size?: number
  strikethrough?: boolean
  transparent?: boolean
} & (
  | {
      icon?: undefined
      label: string
    }
  | {
      icon: Pick<ThemedIconProps, 'family' | 'name' | 'color'>
      label?: undefined
    })

export const TagToken = React.memo((props: TagTokenProps) => {
  const {
    icon,
    label,
    onPress,
    onRemove,
    size = smallTextSize + 4 + contentPadding + 2,
    strikethrough,
    transparent,
  } = props

  const iconOrLabelStyle: ThemedTextProps['style'] = {
    marginTop: icon ? 2 : -1,
    lineHeight: smallTextSize + 5 + (icon ? 4 : 0),
    fontSize: smallTextSize + (icon ? 4 : 0),
    fontWeight: '300',
    textAlign: 'center',
    textDecorationLine: strikethrough && !icon ? 'line-through' : 'none',
  }

  return (
    <Button
      colors={
        icon && strikethrough
          ? { backgroundThemeColor: 'backgroundColorTintedRed' }
          : transparent
          ? { backgroundThemeColor: 'transparent' }
          : undefined
      }
      contentContainerStyle={
        icon
          ? sharedStyles.paddingHorizontalNone
          : sharedStyles.paddingHorizontalHalf
      }
      onPress={onPress}
      size={size}
      type="neutral"
      withBorder
    >
      <View style={sharedStyles.horizontalAndVerticallyAligned}>
        <Spacer width={contentPadding / 2} />

        {icon ? (
          <ThemedIcon
            color={icon.color || 'foregroundColor'}
            family={icon.family as any}
            name={icon.name as any}
            style={iconOrLabelStyle}
          />
        ) : (
          <ThemedText color="foregroundColor" style={iconOrLabelStyle}>
            {label}
          </ThemedText>
        )}

        {onRemove ? (
          <>
            <Spacer width={contentPadding / 3} />

            <Button
              colors={{
                backgroundThemeColor: 'transparent',
                foregroundThemeColor: 'foregroundColor',
                backgroundHoverThemeColor: 'backgroundColor',
                foregroundHoverThemeColor: 'foregroundColor',
              }}
              hitSlop={{
                top: contentPadding,
                bottom: contentPadding,
                right: contentPadding,
                left: contentPadding / 4,
              }}
              style={{
                marginTop: 1,
              }}
              contentContainerStyle={{
                paddingHorizontal: 0,
                width: smallTextSize + 3,
                height: smallTextSize + 3,
              }}
              onPress={onRemove}
              size={smallTextSize + 3}
              type="custom"
            >
              {({ foregroundThemeColor }) => (
                <ThemedIcon
                  color={foregroundThemeColor}
                  name="x"
                  size={smallTextSize - 3}
                  style={{
                    lineHeight: smallTextSize + 3,
                  }}
                />
              )}
            </Button>

            <Spacer width={contentPadding / 3} />
          </>
        ) : (
          <Spacer width={contentPadding / 2} />
        )}
      </View>
    </Button>
  )
})

TagToken.displayName = 'TagToken'
