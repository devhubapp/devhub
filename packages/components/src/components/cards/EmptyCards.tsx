import { EnhancedLoadState } from '@devhub/core'
import React from 'react'
import { Image, View } from 'react-native'

import { useColumnLoadingState } from '../../hooks/use-column-loading-state'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { Button, defaultButtonSize } from '../common/Button'
import { fabSize, fabSpacing } from '../common/FAB'
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Spacer } from '../common/Spacer'
import { ThemedActivityIndicator } from '../themed/ThemedActivityIndicator'
import { ThemedText } from '../themed/ThemedText'
import {
  GenericMessageWithButtonView,
  GenericMessageWithButtonViewProps,
} from './GenericMessageWithButtonView'

const clearMessages = [
  "You're doing great!",
  'All clear!',
  'Awesome!',
  'Good job!',
  'Great work!',
  'You rock!',
]

const emojis: GitHubEmoji[] = ['+1', 'muscle', 'tada', '100']

const getRandomClearMessage = () => {
  const randomIndex = Math.floor(Math.random() * clearMessages.length)
  return clearMessages[randomIndex]
}

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

// only one emoji per app session
// because dynamic content is bit distractive
const randomClearMessage = getRandomClearMessage()
const randomEmoji = getRandomEmoji()

export const defaultCardFooterSpacing =
  fabSpacing + Math.abs(fabSize - defaultButtonSize) / 2
export const defaultCardFooterHeight =
  defaultButtonSize + 2 * defaultCardFooterSpacing

export interface EmptyCardsProps {
  clearEmoji?: GitHubEmoji | null
  clearMessage?: string
  columnId: string
  disableLoadingIndicator?: boolean
  emoji?: GitHubEmoji | null
  errorButtonView?: GenericMessageWithButtonViewProps['buttonView']
  errorMessage?: string
  errorTitle?: string
  fetchNextPage: (() => void) | undefined
  footer?: React.ReactNode
  loadState?: EnhancedLoadState
  refresh: (() => void | Promise<void>) | undefined
}

export const EmptyCards = React.memo((props: EmptyCardsProps) => {
  const {
    clearEmoji = randomEmoji,
    clearMessage = randomClearMessage,
    columnId,
    disableLoadingIndicator,
    emoji = 'warning',
    errorButtonView,
    errorMessage,
    errorTitle = 'Something went wrong',
    fetchNextPage,
    footer,
    loadState: _loadStateProp,
    refresh,
  } = props

  const _loadState = useColumnLoadingState(columnId)
  const loadState = _loadStateProp || _loadState

  const clearEmojiURL = clearEmoji ? getEmojiImageURL(clearEmoji) : undefined
  const hasError = errorMessage || loadState === 'error'

  const renderContent = () => {
    if (
      !disableLoadingIndicator &&
      (loadState === 'loading_first' ||
        (loadState === 'loading' && !refresh && !fetchNextPage))
    ) {
      return <ThemedActivityIndicator color="foregroundColor" />
    }

    if (hasError) {
      return (
        <GenericMessageWithButtonView
          buttonView={
            errorButtonView ||
            (!!refresh && (
              <Button
                analyticsLabel="try_again"
                children="Try again"
                disabled={loadState !== 'error'}
                loading={!disableLoadingIndicator && loadState === 'loading'}
                onPress={() => refresh()}
              />
            ))
          }
          emoji={emoji}
          title={errorTitle}
          subtitle={errorMessage}
        />
      )
    }

    return (
      <View
        style={[
          sharedStyles.fullWidth,
          sharedStyles.padding,
          sharedStyles.center,
        ]}
        pointerEvents="box-none"
      >
        {!!clearEmojiURL && (
          <>
            <Image
              source={{ uri: clearEmojiURL }}
              style={{ width: 24, height: 24 }}
            />

            {!!clearMessage && <Spacer height={contentPadding / 2} />}
          </>
        )}

        {!!clearMessage && (
          <ThemedText
            color="foregroundColorMuted65"
            style={[
              sharedStyles.textCenter,
              {
                fontSize: 20,
                fontWeight: '200',
              },
            ]}
          >
            {clearMessage}
          </ThemedText>
        )}
      </View>
    )
  }

  return (
    <>
      <FullHeightScrollView
        style={sharedStyles.flex}
        contentContainerStyle={sharedStyles.center}
        pointerEvents="box-none"
      >
        {renderContent()}
      </FullHeightScrollView>

      {footer}
    </>
  )
})

EmptyCards.displayName = 'EmptyCards'
