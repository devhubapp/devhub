import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'

import { constants, GitHubAppType } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { bugsnag } from '../../libs/bugsnag'
import { executeOAuth } from '../../libs/oauth'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { tryParseOAuthParams } from '../../utils/helpers/auth'
import {
  getEmojiImageURL,
  GitHubEmoji,
} from '../../utils/helpers/github/emojis'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { Button } from '../common/Button'

export interface NoTokenViewProps {
  emoji?: GitHubEmoji
  githubAppType: GitHubAppType | 'both'
  subtitle?: string
  title?: string
}

export const NoTokenView = React.memo((props: NoTokenViewProps) => {
  const {
    emoji = 'warning',
    githubAppType,
    subtitle = 'Required permission is missing',
    title = 'Please login again',
  } = props

  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const existingAppToken = useReduxState(selectors.appTokenSelector)
  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const loginRequest = useReduxAction(actions.loginRequest)

  const emojiImageURL = getEmojiImageURL(emoji)

  async function startOAuth() {
    try {
      analytics.trackEvent('engagement', `relogin_add_token_${githubAppType}`)

      const params = await executeOAuth(githubAppType, {
        appToken: existingAppToken,
        scope:
          githubAppType === 'oauth' || githubAppType === 'both'
            ? constants.DEFAULT_GITHUB_OAUTH_SCOPES
            : undefined,
      })
      const { appToken } = tryParseOAuthParams(params)
      if (!appToken) return

      loginRequest({ appToken })
    } catch (error) {
      const description = 'OAuth execution failed'
      console.error(description, error)
      setIsExecutingOAuth(false)

      if (error.message === 'Canceled' || error.message === 'Timeout') return
      bugsnag.notify(error, { description })

      alert(`Login failed. ${error || ''}`)
    }
  }

  const renderContent = () => {
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

        <View style={{ padding: contentPadding }}>
          <Button
            analyticsLabel={`relogin_with_github_${githubAppType}`}
            children="Login with GitHub"
            loading={isLoggingIn || isExecutingOAuth}
            onPress={() => startOAuth()}
          />
        </View>
      </View>
    )
  }

  return (
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
        {renderContent()}
      </View>
    </View>
  )
})
