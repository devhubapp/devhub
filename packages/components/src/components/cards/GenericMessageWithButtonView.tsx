import React from 'react'
import { Image, View, ViewProps } from 'react-native'

import { sharedStyles } from '../../styles/shared'
import {
  contentPadding,
  normalTextSize,
  scaleFactor,
  smallTextSize,
} from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'

export interface GenericMessageWithButtonViewProps {
  buttonView: React.ReactNode
  emoji: GitHubEmoji | null
  footer?: React.ReactNode
  fullCenter?: boolean
  style?: ViewProps['style']
  subtitle: string | undefined | null
  title: string | undefined | null
}

export const GenericMessageWithButtonView = React.memo(
  (props: GenericMessageWithButtonViewProps) => {
    const {
      buttonView,
      emoji,
      footer,
      fullCenter,
      style,
      subtitle,
      title,
    } = props

    const emojiImageURL = emoji ? getEmojiImageURL(emoji) : null

    return (
      <>
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              width: '100%',
              padding: contentPadding,
            },
            fullCenter && {
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            },
            style,
          ]}
          pointerEvents="box-none"
        >
          {!!emojiImageURL && (
            <>
              <Image
                source={{ uri: emojiImageURL }}
                style={[
                  sharedStyles.alignSelfCenter,
                  {
                    width: normalTextSize * 2,
                    height: normalTextSize * 2,
                    marginBottom: contentPadding / 4,
                  },
                ]}
              />

              {!!(title || subtitle) && <Spacer height={contentPadding / 2} />}
            </>
          )}

          <ThemedText
            color="foregroundColorMuted65"
            style={[
              sharedStyles.textCenter,
              {
                lineHeight: normalTextSize + (4 + 2) * scaleFactor,
                fontSize: normalTextSize + 4 * scaleFactor,
                fontWeight: '600',
              },
            ]}
          >
            {title}
          </ThemedText>

          {!!subtitle && (
            <>
              {!!title && <Spacer height={contentPadding / 2} />}

              <ThemedText
                color="foregroundColorMuted65"
                style={[
                  sharedStyles.textCenter,
                  {
                    lineHeight: smallTextSize + 3 * scaleFactor,
                    fontSize: smallTextSize,
                    fontWeight: '300',
                  },
                ]}
              >
                {subtitle}
              </ThemedText>
            </>
          )}

          <Spacer height={contentPadding / 2} />

          {!!buttonView && (
            <View style={{ padding: contentPadding }}>{buttonView}</View>
          )}
        </View>

        {footer}
      </>
    )
  },
)

GenericMessageWithButtonView.displayName = 'GenericMessageWithButtonView'
