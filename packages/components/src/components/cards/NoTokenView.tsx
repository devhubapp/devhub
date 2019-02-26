import React, { useState } from 'react'
import { View } from 'react-native'

import { constants, GitHubAppType } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { bugsnag } from '../../libs/bugsnag'
import { executeOAuth } from '../../libs/oauth'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { tryParseOAuthParams } from '../../utils/helpers/auth'
import { GitHubEmoji } from '../../utils/helpers/github/emojis'
import { Button } from '../common/Button'
import { GenericMessageWithButtonView } from './GenericMessageWithButtonView'

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
  const existingAppToken = useReduxState(selectors.appTokenSelector)
  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const loginRequest = useReduxAction(actions.loginRequest)

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
      if (!appToken) throw new Error('No app token')

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
        <GenericMessageWithButtonView
          buttonView={
            <Button
              analyticsLabel={`relogin_with_github_${githubAppType}`}
              children="Login with GitHub"
              loading={isLoggingIn || isExecutingOAuth}
              onPress={() => startOAuth()}
            />
          }
          emoji={emoji}
          subtitle={subtitle}
          title={title}
        />
      </View>
    </View>
  )
})
