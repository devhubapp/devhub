import React, { useContext } from 'react'
import { Text, View } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { ThemeContext } from '../context/ThemeContext'

const clearMessages = [
  'All clear!',
  'Awesome!',
  'Good job!',
  "You're doing great!",
  'You rock!',
]

const emojis = ['👍', '👏', '💪', '🎉', '💯']

const getRandomClearMessage = () => {
  const randomIndex = Math.floor(Math.random() * clearMessages.length)
  return clearMessages[randomIndex]
}

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

// only one message per app running instance
// because a chaning message is a bit distractive
const clearMessage = getRandomClearMessage()
const emoji = getRandomEmoji()

export interface EmptyCardsProps {
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
}

export function EmptyCards(props: EmptyCardsProps) {
  const { theme } = useContext(ThemeContext)

  return (
    <TransparentTextOverlay
      color={theme.backgroundColor}
      size={contentPadding}
      from="vertical"
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: contentPadding,
          }}
        >
          <Text style={{ color: theme.foregroundColorMuted50 }}>
            {clearMessage} {emoji}
          </Text>
        </View>

        <View style={{ minHeight: 40 + 2 * contentPadding }}>
          {!!props.fetchNextPage && (
            <View style={{ padding: contentPadding }}>
              <Button
                onPress={() => props.fetchNextPage!()}
                children="Load more"
              />
            </View>
          )}
        </View>
      </View>
    </TransparentTextOverlay>
  )
}
