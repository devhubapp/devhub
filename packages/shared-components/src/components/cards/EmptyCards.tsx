import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { LoadState } from 'shared-core/dist/types'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useTheme } from '../context/ThemeContext'

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
  loadState: LoadState
}

export function EmptyCards(props: EmptyCardsProps) {
  const theme = useTheme()

  const { fetchNextPage, loadState } = props

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
          {loadState === 'loading_first' ? (
            <ActivityIndicator color={theme.foregroundColor} />
          ) : (
            <Text style={{ color: theme.foregroundColorMuted50 }}>
              {clearMessage} {emoji}
            </Text>
          )}
        </View>

        <View style={{ minHeight: 40 + 2 * contentPadding }}>
          {!!fetchNextPage && loadState !== 'loading_first' && (
            <View style={{ padding: contentPadding }}>
              <Button
                children="Load more"
                disabled={loadState !== 'loaded'}
                loading={loadState === 'loading_more'}
                onPress={() => fetchNextPage()}
              />
            </View>
          )}
        </View>
      </View>
    </TransparentTextOverlay>
  )
}
