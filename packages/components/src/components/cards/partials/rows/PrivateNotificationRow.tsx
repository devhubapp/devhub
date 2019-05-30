import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useReduxAction } from '../../../../hooks/use-redux-action'
import { useReduxState } from '../../../../hooks/use-redux-state'
import { analytics } from '../../../../libs/analytics'
import { bugsnag } from '../../../../libs/bugsnag'
import { executeOAuth } from '../../../../libs/oauth'
import * as actions from '../../../../redux/actions'
import * as selectors from '../../../../redux/selectors'
import { tryParseOAuthParams } from '../../../../utils/helpers/auth'
import { getGitHubAppInstallUri } from '../../../../utils/helpers/shared'
import { Link } from '../../../common/Link'
import { ThemedText } from '../../../themed/ThemedText'
import { cardStyles } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface PrivateNotificationRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  isRead?: boolean
  ownerId?: number | string | undefined
  repoId?: number | string | undefined
}

export const PrivateNotificationRow = React.memo(
  (props: PrivateNotificationRowProps) => {
    const { ownerId, repoId, ...otherProps } = props

    const existingAppToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )
    const loginRequest = useReduxAction(actions.loginRequest)

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
        if (!appToken) throw new Error('No app token')

        loginRequest({ appToken })
      } catch (error) {
        const description = 'OAuth execution failed'
        console.error(description, error)

        if (error.message === 'Canceled' || error.message === 'Timeout') return
        bugsnag.notify(error, { description })

        alert(`Authentication failed. ${error || ''}`)
      }
    }

    function renderContent() {
      if (!(existingAppToken && githubAppToken)) {
        return (
          <Link
            analyticsLabel="setup_github_app_from_private_notification"
            disabled={showLoadingIndicator}
            onPress={() => startOAuth()}
            style={cardRowStyles.mainContentContainer}
            textProps={{
              color: 'foregroundColorMuted60',
              style: [cardStyles.commentText, { fontStyle: 'italic' }],
            }}
          >
            Required permission is missing. Tap to login again.
          </Link>
        )
      }

      return (
        <Link
          analyticsLabel="setup_github_app_from_private_notification"
          href={getGitHubAppInstallUri({
            repositoryIds: repoId ? [repoId] : [],
            suggestedTargetId: ownerId,
          })}
          openOnNewTab={false}
          style={cardRowStyles.mainContentContainer}
          textProps={{
            color: 'foregroundColorMuted60',
            style: [cardStyles.commentText, { fontStyle: 'italic' }],
          }}
        >
          Install the GitHub App on this repo to unlock details from private
          notifications.
        </Link>
      )
    }

    return (
      <BaseRow
        {...otherProps}
        left={null}
        right={
          <>
            <View
              style={{
                flex: 1,
                position: 'relative',
                opacity: showLoadingIndicator ? 0 : 1,
              }}
            >
              {renderContent()}
            </View>

            {!!showLoadingIndicator && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                  },
                ]}
              >
                <ThemedText
                  color="foregroundColorMuted60"
                  style={[cardStyles.commentText, { fontStyle: 'italic' }]}
                >
                  Checking required permissions...
                </ThemedText>
              </View>
            )}
          </>
        }
      />
    )
  },
)
