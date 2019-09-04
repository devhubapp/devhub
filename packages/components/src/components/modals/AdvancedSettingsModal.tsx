import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { constants, GitHubAppType, tryParseOAuthParams } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import { confirm } from '../../libs/confirm'
import { executeOAuth } from '../../libs/oauth'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { clearOAuthQueryParams } from '../../utils/helpers/auth'
import { getGitHubAppInstallUri } from '../../utils/helpers/shared'
import { ModalColumn } from '../columns/ModalColumn'
import { Avatar } from '../common/Avatar'
import { Button, getButtonColors } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'

export interface AdvancedSettingsModalProps {
  showBackButton: boolean
}

export const AdvancedSettingsModal = React.memo(
  (props: AdvancedSettingsModalProps) => {
    const { showBackButton } = props

    const { sizename } = useAppLayout()

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

    const deleteAccountRequest = useReduxAction(actions.deleteAccountRequest)
    const loginRequest = useReduxAction(actions.loginRequest)
    const pushModal = useReduxAction(actions.pushModal)

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
        clearOAuthQueryParams()
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

    const { foregroundThemeColor } = getButtonColors()

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
          contentContainerStyle={sharedStyles.flexGrow}
        >
          {Platform.OS === 'web' && (
            <SubHeader title="Keyboard shortcuts">
              <>
                <Spacer flex={1} />

                <Button
                  analyticsLabel="show_keyboard_shortcuts"
                  contentContainerStyle={{
                    width: 52,
                    paddingHorizontal: contentPadding,
                  }}
                  onPress={() => pushModal({ name: 'KEYBOARD_SHORTCUTS' })}
                  size={32}
                >
                  <ThemedIcon
                    name="keyboard"
                    color={foregroundThemeColor}
                    size={16}
                  />
                </Button>
              </>
            </SubHeader>
          )}

          <View>
            <View>
              <SubHeader title="Manage OAuth access" />

              <View
                style={[
                  sharedStyles.horizontal,
                  sharedStyles.alignItemsCenter,
                  {
                    paddingHorizontal: contentPadding,
                  },
                ]}
              >
                <ThemedText color="foregroundColor" style={sharedStyles.flex}>
                  GitHub OAuth
                </ThemedText>

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
                    <ThemedIcon
                      color={foregroundThemeColor}
                      name="gear"
                      size={16}
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
                    <ThemedIcon
                      color={foregroundThemeColor}
                      name={githubOAuthToken ? 'sync' : 'plus'}
                      size={16}
                    />
                  </Button>
                )}
              </View>

              <Spacer height={contentPadding / 2} />

              <View
                style={[
                  sharedStyles.horizontal,
                  sharedStyles.alignItemsCenter,
                  {
                    paddingHorizontal: contentPadding,
                  },
                ]}
              >
                <ThemedText color="foregroundColor" style={sharedStyles.flex}>
                  GitHub App
                </ThemedText>

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
                    <ThemedIcon
                      color={foregroundThemeColor}
                      name="gear"
                      size={16}
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
                    <ThemedIcon
                      color={foregroundThemeColor}
                      name={githubAppToken ? 'sync' : 'plus'}
                      size={16}
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
                          <ThemedIcon
                            color={foregroundThemeColor}
                            name="plus"
                            size={16}
                          />
                        </ButtonLink>
                      )}
                    </>
                  </SubHeader>

                  {installations.map(
                    (installation, index) =>
                      !!(
                        installation &&
                        installation.account &&
                        installation.account.login &&
                        installation.htmlUrl
                      ) && (
                        <View
                          key={`github-installation-${installation.id}`}
                          style={[
                            sharedStyles.horizontal,
                            sharedStyles.alignItemsCenter,
                            {
                              paddingTop: index === 0 ? 0 : contentPadding / 2,
                              paddingHorizontal: contentPadding,
                            },
                          ]}
                        >
                          <Avatar
                            avatarUrl={
                              installation.account.avatarUrl || undefined
                            }
                            username={installation.account.login}
                            linkURL={installation.account.htmlUrl || undefined}
                            size={24}
                          />

                          <ThemedText
                            color="foregroundColor"
                            style={[
                              sharedStyles.flex,
                              {
                                paddingHorizontal: contentPadding / 2,
                              },
                            ]}
                          >
                            {installation.account.login}
                          </ThemedText>

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
                            <ThemedIcon
                              color={foregroundThemeColor}
                              name="gear"
                              size={16}
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
              type="danger"
            >
              Delete account
            </Button>
          </View>
        </ScrollView>
      </ModalColumn>
    )
  },
)

AdvancedSettingsModal.displayName = 'AdvancedSettingsModal'
