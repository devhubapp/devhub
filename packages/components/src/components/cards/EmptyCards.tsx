import React from 'react'
import { Image, View } from 'react-native'

import { Column, EnhancedLoadState } from '@devhub/core'
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
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { ThemedActivityIndicator } from '../themed/ThemedActivityIndicator'
import { ThemedText } from '../themed/ThemedText'
import { cardSearchTotalHeight, CardsSearchHeader } from './CardsSearchHeader'
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
  column: Column
  disableSearch?: boolean
  disableShowClearedView?: boolean
  emoji?: GitHubEmoji | null
  errorButtonView?: GenericMessageWithButtonViewProps['buttonView']
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
    column,
    disableSearch,
    disableShowClearedView,
    emoji = 'warning',
    errorButtonView,
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

  const clearEmojiURL = clearEmoji ? getEmojiImageURL(clearEmoji) : undefined
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
            errorButtonView ||
            (!!refresh && (
              <Button
                analyticsLabel="try_again"
                children="Try again"
                disabled={loadState !== 'error'}
                loading={loadState === 'loading'}
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
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: contentPadding,
        }}
      >
        {!!clearMessage && (
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
        )}

        {!!clearEmojiURL && (
          <>
            {!!clearMessage && <Spacer width={contentPadding / 2} />}

            <Image
              source={{ uri: clearEmojiURL }}
              style={{ width: 24, height: 24 }}
            />
          </>
        )}
      </View>
    )
  }

  return (
    <FullHeightScrollView
      contentOffset={{ x: 0, y: disableSearch ? 0 : cardSearchTotalHeight }}
      style={sharedStyles.flex}
    >
      {!disableSearch && (
        <CardsSearchHeader
          key={`cards-search-header-column-${column.id}`}
          columnId={column.id}
        />
      )}

      <View style={{ height: defaultCardFooterHeight }} />

      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
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
              disabled={loadState === 'loading' || loadState === 'loading_more'}
              loading={loadState === 'loading_more'}
              onPress={fetchNextPage}
            />
          </View>
        ) : !disableShowClearedView &&
          column.filters &&
          column.filters.clearedAt ? (
          <View
            style={{
              paddingHorizontal: contentPadding,
              paddingVertical: defaultCardFooterSpacing,
            }}
          >
            <Button
              analyticsLabel="show_cleared"
              children="Show cleared items"
              onPress={() => {
                setColumnClearedAtFilter({
                  clearedAt: null,
                  columnId: column.id,
                })
                if (refresh) refresh()
              }}
              showBorder
              transparent
            />
          </View>
        ) : shouldRenderFAB({ sizename }) ? (
          <Spacer height={fabSize + 2 * fabSpacing} />
        ) : null}
      </View>
    </FullHeightScrollView>
  )
})
