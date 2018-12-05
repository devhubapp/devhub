import React from 'react'
import {
  ActivityIndicator,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { LoadState } from '@devhub/core/src/types'
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
  errorMessage?: string
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  refresh: (() => void | Promise<void>) | undefined
}

export function EmptyCards(props: EmptyCardsProps) {
  const theme = useTheme()

  const { errorMessage, fetchNextPage, loadState, refresh } = props

  const hasError = errorMessage || loadState === 'error'

  const renderContent = () => {
    if (loadState === 'loading_first') {
      return <ActivityIndicator color={theme.foregroundColor} />
    }

    const containerStyle: ViewStyle = { width: '100%', padding: contentPadding }
    const textStyle: TextStyle = {
      lineHeight: 20,
      fontSize: 14,
      color: theme.foregroundColorMuted50,
      textAlign: 'center',
    }

    if (hasError) {
      return (
        <View style={containerStyle}>
          <Text style={textStyle}>
            {`⚠️\nSomething went wrong`}
            {!!errorMessage && (
              <Text style={{ fontSize: 13 }}>{`\nError: ${errorMessage}`}</Text>
            )}
          </Text>

          {!!refresh && (
            <View style={{ padding: contentPadding }}>
              <Button
                children="Try again"
                disabled={loadState !== 'error'}
                loading={loadState === 'loading'}
                onPress={() => refresh()}
              />
            </View>
          )}
        </View>
      )
    }

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>
          {clearMessage} {emoji}
        </Text>
      </View>
    )
  }

  const headerOrFooterHeight = 40 + 2 * contentPadding

  return (
    <TransparentTextOverlay
      color={theme.backgroundColor}
      size={contentPadding}
      from="vertical"
    >
      <View style={{ flex: 1 }}>
        <View style={{ height: headerOrFooterHeight }} />

        <View
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: contentPadding,
          }}
        >
          {renderContent()}
        </View>

        <View style={{ minHeight: headerOrFooterHeight }}>
          {!!fetchNextPage && !hasError && loadState !== 'loading_first' && (
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
