import React from 'react'
import { Image, Text, View } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'

export interface GenericMessageWithButtonViewProps {
  buttonView: React.ReactNode
  emoji: GitHubEmoji
  subtitle: string | undefined
  title: string
}

export const GenericMessageWithButtonView = React.memo(
  (props: GenericMessageWithButtonViewProps) => {
    const { buttonView, emoji, subtitle, title } = props

    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const emojiImageURL = getEmojiImageURL(emoji)

    return (
      <View
        style={{
          width: '100%',
          padding: contentPadding,
        }}
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

        <SpringAnimatedText
          style={{
            lineHeight: 20,
            fontSize: 14,
            color: springAnimatedTheme.foregroundColorMuted50,
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
        </SpringAnimatedText>

        {!!buttonView && (
          <View style={{ padding: contentPadding }}>{buttonView}</View>
        )}
      </View>
    )
  },
)
