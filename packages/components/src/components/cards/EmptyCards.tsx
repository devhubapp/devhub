import React from 'react'
import { Image, Text, View, ViewStyle } from 'react-native'

import { EnhancedLoadState } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { Button, defaultButtonSize } from '../common/Button'
import { fabSize } from '../common/FAB'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { ThemedActivityIndicator } from '../themed/ThemedActivityIndicator'
import { ThemedText } from '../themed/ThemedText'
import { GenericMessageWithButtonView } from './GenericMessageWithButtonView'

const clearMessages = [
  'All clear!',
  'Awesome!',
  'Good job!',
  "You're doing great!",
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

// only one message per app running instance
// because a chaning message is a bit distractive
const randomClearMessage = getRandomClearMessage()
const randomEmoji = getRandomEmoji()

export const defaultCardFooterSpacing =
  fabSpacing + Math.abs(fabSize - defaultButtonSize) / 2
export const defaultCardFooterHeight =
  defaultButtonSize + 2 * defaultCardFooterSpacing

export interface EmptyCardsProps {
  clearEmoji?: GitHubEmoji
  clearMessage?: string
  clearedAt: string | undefined
  columnId: string
  emoji?: GitHubEmoji
  errorMessage?: string
  errorTitle?: string
  fetchNextPage: (() => void) | undefined
  loadState: EnhancedLoadState
  refresh: (() => void | Promise<void>) | undefined
}

export const EmptyCards = React.memo((props: EmptyCardsProps) => {
  const {
    clearEmoji = randomEmoji,
    clearMessage = randomClearMessage,
    clearedAt,
    columnId,
    emoji = 'warning',
    errorMessage,
    errorTitle = 'Something went wrong',
    fetchNextPage,
    loadState,
    refresh,
  } = props

  const { sizename } = useAppLayout()

  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const clearEmojiURL = getEmojiImageURL(clearEmoji)
  const hasError = errorMessage || loadState === 'error'

  const renderContent = () => {
    if (
      loadState === 'loading_first' ||
      (loadState === 'loading' && !refresh && !fetchNextPage)
    ) {
      return <ThemedActivityIndicator color="foregroundColor" />
    }

    if (hasError) {
      return (
        <GenericMessageWithButtonView
          buttonView={
            !!refresh && (
              <Button
                analyticsLabel="try_again"
                children="Try again"
                disabled={loadState !== 'error'}
                loading={loadState === 'loading'}
                onPress={() => refresh()}
              />
            )
          }
          emoji={emoji}
          title={errorTitle}
          subtitle={errorMessage}
        />
      )
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: contentPadding,
        }}
      >
        <ThemedText
          color="foregroundColorMuted40"
          style={{
            fontSize: 20,
            fontWeight: '200',
            textAlign: 'center',
          }}
        >
          {clearMessage}
        </ThemedText>

        {!!clearEmojiURL && (
          <>
            <Spacer width={contentPadding / 2} />

            <Image
              source={{ uri: clearEmojiURL }}
              style={{ width: 30, height: 30 }}
            />
          </>
        )}
      </View>
    )
  }

  return (
    <View style={sharedStyles.flex}>
      <View style={{ height: defaultCardFooterHeight }} />

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

      <View style={{ minHeight: defaultCardFooterHeight }}>
        {hasError || loadState === 'loading_first' ? null : fetchNextPage ? (
          <View
            style={{
              paddingHorizontal: contentPadding,
              paddingVertical: defaultCardFooterSpacing,
            }}
          >
            <Button
              analyticsLabel="load_more"
              children="Load more"
              disabled={loadState !== 'loaded'}
              loading={loadState === 'loading_more'}
              onPress={fetchNextPage}
            />
          </View>
        ) : clearedAt ? (
          <View
            style={{
              paddingHorizontal: contentPadding,
              paddingVertical: defaultCardFooterSpacing,
            }}
          >
            <Button
              analyticsLabel="show_cleared"
              children="Show cleared items"
              showBorder
              onPress={() => {
                setColumnClearedAtFilter({ clearedAt: null, columnId })
                if (refresh) refresh()
              }}
              transparent
            />
          </View>
        ) : shouldRenderFAB({ sizename }) ? (
          <Spacer height={fabSize + 2 * fabSpacing} />
        ) : null}
      </View>
    </View>
  )
})
