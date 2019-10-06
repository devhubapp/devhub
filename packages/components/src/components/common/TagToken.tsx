import React from 'react'
import { View } from 'react-native'

import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallTextSize } from '../../styles/variables'
import { Button } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'

export interface TagTokenProps {
  label: string
  onPress: () => void
  onRemove?: (() => void) | undefined
  size?: number
  strikethrough?: boolean
}

export const TagToken = React.memo((props: TagTokenProps) => {
  const {
    label,
    onPress,
    onRemove,
    size = smallTextSize + 4 + contentPadding + 2,
    strikethrough,
  } = props

  return (
    <Button
      contentContainerStyle={sharedStyles.paddingHorizontalHalf}
      onPress={onPress}
      size={size}
      type="neutral"
    >
      <View style={sharedStyles.horizontalAndVerticallyAligned}>
        <Spacer width={contentPadding / 2} />

        <ThemedText
          color="foregroundColor"
          style={{
            marginTop: -1,
            lineHeight: smallTextSize + 5,
            fontSize: smallTextSize,
            fontWeight: '300',
            textAlign: 'center',
            textDecorationLine: strikethrough ? 'line-through' : 'none',
          }}
        >
          {label}
        </ThemedText>

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
