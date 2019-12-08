import { tryParseOAuthParams } from '@devhub/core'
import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { useDispatch } from 'react-redux'
import { useReduxState } from '../../../../hooks/use-redux-state'
import { analytics } from '../../../../libs/analytics'
import { bugsnag } from '../../../../libs/bugsnag'
import { executeOAuth } from '../../../../libs/oauth'
import { Platform } from '../../../../libs/platform'
import * as actions from '../../../../redux/actions'
import * as selectors from '../../../../redux/selectors'
import { sharedStyles } from '../../../../styles/shared'
import { clearOAuthQueryParams } from '../../../../utils/helpers/auth'
import { getGitHubAppInstallUri } from '../../../../utils/helpers/shared'
import { Link } from '../../../common/Link'
import { ThemedText, ThemedTextProps } from '../../../themed/ThemedText'

export interface InstallGitHubAppTextProps {
  ownerId?: number | string | undefined
  repoId?: number | string | undefined
  text?: string
  textProps?: Omit<ThemedTextProps, 'children'>
}

const GestureHandlerTouchableOpacity = Platform.select({
  android: () => require('react-native-gesture-handler').TouchableOpacity,
  ios: () => require('react-native-gesture-handler').TouchableOpacity,
  default: () => require('../../../common/TouchableOpacity').TouchableOpacity,
})()

export const styles = StyleSheet.create({
  link: {
    flexGrow: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '100%',
  },
})

export const InstallGitHubAppText = React.memo(
  (props: InstallGitHubAppTextProps) => {
    const { ownerId, repoId, text, textProps } = props

    const dispatch = useDispatch()
    const existingAppToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )

    const showLoadingIndicator =
      isLoggingIn || installationsLoadState === 'loading'

    async function startOAuth() {
      try {
        analytics.trackEvent('engagement', 'relogin_add_token_app')

        const params = await executeOAuth('app', {
          appToken: existingAppToken,
          scope: undefined,
        })

        const { appToken } = tryParseOAuthParams(params)
        clearOAuthQueryParams()
        if (!appToken) throw new Error('No app token')

        dispatch(actions.loginRequest({ appToken }))
      } catch (error) {
        const description = 'OAuth execution failed'
        console.error(description, error)

        if (error.message === 'Canceled' || error.message === 'Timeout') return
        bugsnag.notify(error, { description })

        Alert.alert(`Authentication failed. ${error || ''}`)
      }
    }

    function renderContent() {
      if (!(existingAppToken && githubAppToken)) {
        return (
          <Link
            TouchableComponent={GestureHandlerTouchableOpacity}
            analyticsLabel="setup_github_app_from_card"
            disabled={showLoadingIndicator}
            enableForegroundHover
            onPress={() => startOAuth()}
            style={styles.link}
            textProps={textProps}
          >
            Required permission is missing. Tap to login again.
          </Link>
        )
      }

      return (
        <Link
          TouchableComponent={GestureHandlerTouchableOpacity}
          analyticsLabel="setup_github_app_from_card"
          enableForegroundHover
          href={getGitHubAppInstallUri({
            repositoryIds: repoId ? [repoId] : [],
            suggestedTargetId: ownerId,
          })}
          openOnNewTab={false}
          style={styles.link}
          textProps={textProps}
        >
          {text || 'Install the GitHub App to unlock more details'}
        </Link>
      )
    }

    return (
      <View style={sharedStyles.flex}>
        <View
          style={[
            sharedStyles.flex,
            sharedStyles.relative,
            { opacity: showLoadingIndicator ? 0 : 1 },
          ]}
        >
          {renderContent()}
        </View>

        {!!showLoadingIndicator && (
          <View
            style={[
              StyleSheet.absoluteFill,
              sharedStyles.alignSelfFlexStart,
              sharedStyles.justifyContentFlexStart,
            ]}
          >
            <ThemedText {...textProps}>
              Checking required permissions...
            </ThemedText>
          </View>
        )}
      </View>
    )
  },
)

InstallGitHubAppText.displayName = 'InstallGitHubAppText'
