import React from 'react'
import { Image, View, ViewProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'

export interface GenericMessageWithButtonViewProps {
  buttonView: React.ReactNode
  emoji: GitHubEmoji | null
  fullCenter?: boolean
  style?: ViewProps['style']
  subtitle: string | undefined | null
  title: string | undefined | null
}

export const GenericMessageWithButtonView = React.memo(
  (props: GenericMessageWithButtonViewProps) => {
    const { buttonView, emoji, fullCenter, style, subtitle, title } = props

    const emojiImageURL = emoji ? getEmojiImageURL(emoji) : null

    return (
      <View
        style={[
          fullCenter && {
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            width: '100%',
            padding: contentPadding,
          },
          style,
        ]}
      >
        {!!emojiImageURL && (
          <>
            <Image
              source={{ uri: emojiImageURL }}
              style={{
                alignSelf: 'center',
                width: 24,
                height: 24,
                marginBottom: 4,
              }}
            />

            {!!(title || subtitle) && <Spacer height={contentPadding / 2} />}
          </>
        )}

        <ThemedText
          color="foregroundColorMuted60"
          style={{
            fontSize: 18,
            fontWeight: '200',
            textAlign: 'center',
          }}
        >
          {title}
        </ThemedText>

        {!!subtitle && (
          <>
            {!!title && <Spacer height={contentPadding / 2} />}

            <ThemedText
              color="foregroundColorMuted60"
              style={{
                fontSize: 13,
                fontWeight: '200',
                textAlign: 'center',
              }}
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
    )
  },
)
