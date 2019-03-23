import React from 'react'
import { Image, Text, TextStyle, View, ViewStyle } from 'react-native'

import { EnhancedLoadState } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { SpringAnimatedActivityIndicator } from '../animated/spring/SpringAnimatedActivityIndicator'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { Button, defaultButtonSize } from '../common/Button'
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
const clearMessage = getRandomClearMessage()
const randomEmoji = getRandomEmoji()
const randomEmojiImageURL = getEmojiImageURL(randomEmoji)

export interface EmptyCardsProps {
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
    clearedAt,
    columnId,
    emoji = 'warning',
    errorMessage,
    errorTitle = 'Something went wrong',
    fetchNextPage,
    loadState,
    refresh,
  } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const hasError = errorMessage || loadState === 'error'

  const renderContent = () => {
    if (
      loadState === 'loading_first' ||
      (loadState === 'loading' && !refresh && !fetchNextPage)
    ) {
      return (
        <SpringAnimatedActivityIndicator
          color={springAnimatedTheme.foregroundColor}
        />
      )
    }

    const containerStyle: ViewStyle = {
      width: '100%',
      padding: contentPadding,
    }

    const springAnimatedTextStyle = {
      lineHeight: 20,
      fontSize: 14,
      color: springAnimatedTheme.foregroundColorMuted50,
      textAlign: 'center',
    } as TextStyle

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
      <View style={containerStyle}>
        <SpringAnimatedText style={springAnimatedTextStyle}>
          {clearMessage}
          {!!randomEmojiImageURL && (
            <>
              <Text children=" " />

              <Image
                source={{ uri: randomEmojiImageURL }}
                style={{ width: 16, height: 16 }}
              />
            </>
          )}
        </SpringAnimatedText>
      </View>
    )
  }

  const headerOrFooterHeight = defaultButtonSize + 2 * contentPadding

  return (
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
        {hasError || loadState === 'loading_first' ? null : fetchNextPage ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel="load_more"
              children="Load more"
              disabled={loadState !== 'loaded'}
              loading={loadState === 'loading_more'}
              onPress={fetchNextPage}
            />
          </View>
        ) : clearedAt ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel="show_cleared"
              borderOnly
              children="Show cleared items"
              disabled={loadState !== 'loaded'}
              onPress={() => {
                setColumnClearedAtFilter({ clearedAt: null, columnId })
                if (refresh) refresh()
              }}
            />
          </View>
        ) : null}
      </View>
    </View>
  )
})
