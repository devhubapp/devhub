import React from 'react'
import { Image, Text, View, ViewProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { ThemedText } from '../themed/ThemedText'

export interface GenericMessageWithButtonViewProps {
  buttonView: React.ReactNode
  emoji: GitHubEmoji | null
  subtitle: string | undefined | null
  title: string | undefined | null
  style?: ViewProps['style']
}

export const GenericMessageWithButtonView = React.memo(
  (props: GenericMessageWithButtonViewProps) => {
    const { buttonView, emoji, style, subtitle, title } = props

    const emojiImageURL = emoji ? getEmojiImageURL(emoji) : null

    return (
      <View
        style={[
          {
            width: '100%',
            padding: contentPadding,
          },
          style,
        ]}
      >
        {!!emojiImageURL && (
          <Image
            source={{ uri: emojiImageURL }}
            style={{
              alignSelf: 'center',
              width: 16,
              height: 16,
              marginBottom: 4,
            }}
          />
        )}

        <ThemedText
          color="foregroundColorMuted60"
          style={{
            lineHeight: 20,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {title}

          {!!subtitle && (
            <>
              {!!title && <Text>{'\n'}</Text>}
              <Text style={{ fontSize: 13 }}>{subtitle}</Text>
            </>
          )}
        </ThemedText>

        {!!buttonView && (
          <View style={{ padding: contentPadding }}>{buttonView}</View>
        )}
      </View>
    )
  },
)
