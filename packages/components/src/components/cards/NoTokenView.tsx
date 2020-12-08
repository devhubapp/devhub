import React, { useState } from 'react'
import { Alert, View } from 'react-native'

import { constants, GitHubAppType, tryParseOAuthParams } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { bugsnag } from '../../libs/bugsnag'
import { executeOAuth } from '../../libs/oauth'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { clearOAuthQueryParams } from '../../utils/helpers/auth'
import { GitHubEmoji } from '../../utils/helpers/github/emojis'
import { Button } from '../common/Button'
import { GenericMessageWithButtonView } from './GenericMessageWithButtonView'
import { QuickFeedbackRow } from '../common/QuickFeedbackRow'
import { contentPadding } from '../../styles/variables'

export interface NoTokenViewProps {
  emoji?: GitHubEmoji | null
  githubAppType: GitHubAppType | 'both'
  subtitle?: string | null
  title?: string | null
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

      setIsExecutingOAuth(true)

      const params = await executeOAuth(githubAppType, {
        appToken: existingAppToken,
        scope:
          githubAppType === 'oauth' || githubAppType === 'both'
            ? constants.DEFAULT_GITHUB_OAUTH_SCOPES
            : undefined,
      })
      const { appToken } = tryParseOAuthParams(params)
      clearOAuthQueryParams()
      if (!appToken) throw new Error('No app token')

      loginRequest({ appToken })
      setIsExecutingOAuth(false)
    } catch (error) {
      const description = 'OAuth execution failed'
      console.error(description, error)
      setIsExecutingOAuth(false)

      if (error.message === 'Canceled' || error.message === 'Timeout') return
      bugsnag.notify(error, { description })

      Alert.alert(`Authentication failed. ${error || ''}`)
    }
  }

  return (
    <View style={sharedStyles.flex}>
      <View
        style={[
          sharedStyles.flex,
          sharedStyles.center,
          sharedStyles.padding,
          { paddingBottom: contentPadding / 2 },
        ]}
      >
        <GenericMessageWithButtonView
          buttonView={
            <Button
              analyticsLabel={`relogin_with_github_${githubAppType}`}
              loading={isLoggingIn || isExecutingOAuth}
              onPress={() => startOAuth()}
            >
              Login with GitHub
            </Button>
          }
          emoji={emoji}
          footer={<QuickFeedbackRow />}
          subtitle={subtitle}
          title={title}
        />
      </View>
    </View>
  )
})

NoTokenView.displayName = 'NoTokenView'
