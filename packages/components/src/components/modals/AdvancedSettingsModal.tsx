import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { constants, GitHubAppType } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import { confirm } from '../../libs/confirm'
import { executeOAuth } from '../../libs/oauth'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import * as colors from '../../styles/colors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { tryParseOAuthParams } from '../../utils/helpers/auth'
import { getGitHubAppInstallUri } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { ModalColumn } from '../columns/ModalColumn'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'

export interface AdvancedSettingsModalProps {
  showBackButton: boolean
}

export const AdvancedSettingsModal = React.memo(
  (props: AdvancedSettingsModalProps) => {
    const { showBackButton } = props

    const { sizename } = useAppLayout()

    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const [executingOAuth, setExecutingOAuth] = useState<GitHubAppType | null>(
      null,
    )

    const existingAppToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)
    const installations = useReduxState(selectors.installationsArrSelector)
    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )
    const isDeletingAccount = useReduxState(selectors.isDeletingAccountSelector)
    const isLoggingIn = useReduxState(selectors.isLoggingInSelector)

    const loginRequest = useReduxAction(actions.loginRequest)
    const deleteAccountRequest = useReduxAction(actions.deleteAccountRequest)

    async function startOAuth(githubAppType: GitHubAppType) {
      try {
        setExecutingOAuth(githubAppType)

        const params = await executeOAuth(githubAppType, {
          appToken: existingAppToken,
          scope:
            githubAppType === 'oauth'
              ? constants.DEFAULT_GITHUB_OAUTH_SCOPES
              : undefined,
        })
        const { appToken } = tryParseOAuthParams(params)
        if (!appToken) throw new Error('No app token')

        loginRequest({ appToken })
        setExecutingOAuth(null)
      } catch (error) {
        const description = 'OAuth execution failed'
        console.error(description, error)
        setExecutingOAuth(null)

        if (error.message === 'Canceled' || error.message === 'Timeout') return
        bugsnag.notify(error, { description })

        alert(`Authentication failed. ${error || ''}`)
      }
    }

    return (
      <ModalColumn
        hideCloseButton={sizename === '1-small'}
        iconName="gear"
        name="ADVANCED_SETTINGS"
        showBackButton={showBackButton}
        title="Advanced settings"
      >
        <ScrollView
          style={sharedStyles.flex}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View>
            <View>
              <SubHeader title="Manage OAuth access" />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: contentPadding,
                }}
              >
                <SpringAnimatedText
                  style={{
                    flex: 1,
                    color: springAnimatedTheme.foregroundColor,
                  }}
                >
                  GitHub OAuth
                </SpringAnimatedText>

                <Spacer flex={1} minWidth={contentPadding / 2} />

                {githubOAuthToken ? (
                  <ButtonLink
                    analyticsLabel="manage_oauth"
                    contentContainerStyle={{
                      width: 52,
                      paddingHorizontal: contentPadding,
                    }}
                    href={`${constants.API_BASE_URL}/github/oauth/manage`}
                    openOnNewTab
                    size={32}
                  >
                    <SpringAnimatedIcon
                      name="gear"
                      size={16}
                      style={{ color: springAnimatedTheme.foregroundColor }}
                    />
                  </ButtonLink>
                ) : (
                  <Button
                    analyticsLabel={
                      githubOAuthToken ? 'refresh_oauth_token' : 'start_oauth'
                    }
                    contentContainerStyle={{
                      width: 52,
                      paddingHorizontal: contentPadding,
                    }}
                    disabled={!!executingOAuth}
                    loading={executingOAuth === 'oauth'}
                    loadingIndicatorStyle={{ transform: [{ scale: 0.8 }] }}
                    onPress={() => startOAuth('oauth')}
                    size={32}
                  >
                    <SpringAnimatedIcon
                      name={githubOAuthToken ? 'sync' : 'plus'}
                      size={16}
                      style={{ color: springAnimatedTheme.foregroundColor }}
                    />
                  </Button>
                )}
              </View>

              <Spacer height={contentPadding / 2} />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: contentPadding,
                }}
              >
                <SpringAnimatedText
                  style={{
                    flex: 1,
                    color: springAnimatedTheme.foregroundColor,
                  }}
                >
                  GitHub App
                </SpringAnimatedText>

                <Spacer flex={1} minWidth={contentPadding / 2} />

                {githubAppToken ? (
                  <ButtonLink
                    analyticsLabel="manage_app_oauth"
                    contentContainerStyle={{
                      width: 52,
                      paddingHorizontal: contentPadding,
                    }}
                    href={`${constants.API_BASE_URL}/github/app/manage`}
                    openOnNewTab
                    size={32}
                  >
                    <SpringAnimatedIcon
                      name="gear"
                      size={16}
                      style={{ color: springAnimatedTheme.foregroundColor }}
                    />
                  </ButtonLink>
                ) : (
                  <Button
                    analyticsLabel={
                      githubAppToken
                        ? 'refresh_app_oauth_token'
                        : 'start_app_oauth'
                    }
                    contentContainerStyle={{
                      width: 52,
                      paddingHorizontal: contentPadding,
                    }}
                    disabled={!!executingOAuth}
                    loading={executingOAuth === 'app'}
                    loadingIndicatorStyle={{ transform: [{ scale: 0.8 }] }}
                    onPress={() => startOAuth('app')}
                    size={32}
                  >
                    <SpringAnimatedIcon
                      name={githubAppToken ? 'sync' : 'plus'}
                      size={16}
                      style={{ color: springAnimatedTheme.foregroundColor }}
                    />
                  </Button>
                )}
              </View>
            </View>

            {!!githubAppToken && (
              <>
                <Spacer height={contentPadding} />

                <View>
                  <SubHeader title="GitHub App installations">
                    <>
                      <Spacer flex={1} />

                      {!!(
                        githubAppToken || installationsLoadState === 'loading'
                      ) && (
                        <ButtonLink
                          analyticsLabel="open_installation"
                          contentContainerStyle={{
                            width: 52,
                            paddingHorizontal: contentPadding,
                          }}
                          disabled={installationsLoadState === 'loading'}
                          loading={installationsLoadState === 'loading'}
                          loadingIndicatorStyle={{
                            transform: [{ scale: 0.8 }],
                          }}
                          href={getGitHubAppInstallUri()}
                          openOnNewTab={false}
                          size={32}
                        >
                          <SpringAnimatedIcon
                            name="plus"
                            size={16}
                            style={{
                              color: springAnimatedTheme.foregroundColor,
                            }}
                          />
                        </ButtonLink>
                      )}
                    </>
                  </SubHeader>

                  {installations.map(
                    (installation, index) =>
                      !!(
                        installation.account &&
                        installation.account.login &&
                        installation.htmlUrl
                      ) && (
                        <View
                          key={`github-installation-${installation.id}`}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: index === 0 ? 0 : contentPadding / 2,
                            paddingHorizontal: contentPadding,
                          }}
                        >
                          <Avatar
                            avatarUrl={
                              installation.account.avatarUrl || undefined
                            }
                            username={installation.account.login}
                            linkURL={installation.account.htmlUrl || undefined}
                            size={24}
                          />

                          <SpringAnimatedText
                            style={{
                              flex: 1,
                              paddingHorizontal: contentPadding / 2,
                              color: springAnimatedTheme.foregroundColor,
                            }}
                          >
                            {installation.account.login}
                          </SpringAnimatedText>

                          <ButtonLink
                            analyticsLabel="open_installation"
                            contentContainerStyle={{
                              width: 52,
                              paddingHorizontal: contentPadding,
                            }}
                            href={installation.htmlUrl}
                            openOnNewTab
                            size={32}
                          >
                            <SpringAnimatedIcon
                              name="gear"
                              size={16}
                              style={{
                                color: springAnimatedTheme.foregroundColor,
                              }}
                            />
                          </ButtonLink>
                        </View>
                      ),
                  )}
                </View>
              </>
            )}
          </View>

          <Spacer flex={1} minHeight={contentPadding} />

          <View style={{ padding: contentPadding }}>
            <Spacer height={contentPadding} />

            <Button
              key="delete-account-button"
              analyticsAction="delete_account"
              analyticsLabel=""
              disabled={isDeletingAccount || isLoggingIn}
              loading={isDeletingAccount}
              hoverBackgroundColor={colors.red}
              hoverForegroundColor="#FFFFFF"
              onPress={() =>
                confirm(
                  'Delete Account?',
                  'All your columns and preferences will be lost.' +
                    ' If you login again, a new empty account will be created.',
                  {
                    cancelLabel: 'Cancel',
                    confirmLabel: 'Delete',
                    confirmCallback: () => deleteAccountRequest(),
                    destructive: true,
                  },
                )
              }
            >
              Delete account
            </Button>
          </View>
        </ScrollView>
      </ModalColumn>
    )
  },
)
