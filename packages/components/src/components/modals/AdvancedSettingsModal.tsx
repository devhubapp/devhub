import { constants, GitHubAppType, tryParseOAuthParams } from '@devhub/core'
import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import { executeOAuth } from '../../libs/oauth'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, scaleFactor } from '../../styles/variables'
import { clearOAuthQueryParams } from '../../utils/helpers/auth'
import { ModalColumn } from '../columns/ModalColumn'
import { Avatar } from '../common/Avatar'
import { Button, getButtonColors } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { DialogConsumer } from '../context/DialogContext'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { PrivateAccessSettings } from '../widgets/PrivateAccessSettings'

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
    const [] = useState(false)

    const dispatch = useDispatch()
    const existingAppToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const githubToken = useReduxState(selectors.githubTokenSelector)
    const installations = useReduxState(selectors.installationsArrSelector)
    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )
    const isDeletingAccount = useReduxState(selectors.isDeletingAccountSelector)
    const isLoggingIn = useReduxState(selectors.isLoggingInSelector)

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

        dispatch(actions.loginRequest({ appToken }))
        setExecutingOAuth(null)
      } catch (error) {
        const description = 'OAuth execution failed'
        console.error(description, error)
        setExecutingOAuth(null)

        if (error.message === 'Canceled' || error.message === 'Timeout') return
        bugsnag.notify(error, { description })

        Alert.alert(`Authentication failed. ${error || ''}`)
      }
    }

    const { foregroundThemeColor } = getButtonColors()

    return (
      <ModalColumn
        hideCloseButton={sizename === '1-small'}
        name="ADVANCED_SETTINGS"
        showBackButton={showBackButton}
        title="Advanced settings"
      >
        <DialogConsumer>
          {(Dialog) => (
            <>
              <PrivateAccessSettings />

              <View>
                {constants.ENABLE_GITHUB_OAUTH_SUPPORT && (
                  <SubHeader title="Manage GitHub OAuth">
                    <>
                      <Spacer flex={1} />

                      {githubToken ? (
                        <ButtonLink
                          analyticsLabel="manage_oauth"
                          contentContainerStyle={{
                            width: 52 * scaleFactor,
                            paddingHorizontal: contentPadding,
                          }}
                          href={`${constants.API_BASE_URL}/github/oauth/manage`}
                          openOnNewTab
                          size={32 * scaleFactor}
                        >
                          <ThemedIcon
                            color={foregroundThemeColor}
                            family="octicon"
                            name="tools"
                            size={16 * scaleFactor}
                          />
                        </ButtonLink>
                      ) : (
                        <Button
                          analyticsLabel={
                            githubToken ? 'refresh_oauth_token' : 'start_oauth'
                          }
                          contentContainerStyle={{
                            width: 52 * scaleFactor,
                            paddingHorizontal: contentPadding,
                          }}
                          disabled={!!executingOAuth}
                          loading={executingOAuth === 'oauth'}
                          loadingIndicatorStyle={{
                            transform: [{ scale: 0.8 }],
                          }}
                          onPress={() => startOAuth('oauth')}
                          size={32 * scaleFactor}
                        >
                          <ThemedIcon
                            color={foregroundThemeColor}
                            family="octicon"
                            name={githubToken ? 'sync' : 'plus'}
                            size={16 * scaleFactor}
                          />
                        </Button>
                      )}
                    </>
                  </SubHeader>
                )}

                {constants.ENABLE_GITHUB_APP_SUPPORT && (
                  <SubHeader title="Manage GitHub App">
                    <>
                      <Spacer flex={1} />

                      {githubAppToken ? (
                        <ButtonLink
                          analyticsLabel="manage_app_oauth"
                          contentContainerStyle={{
                            width: 52 * scaleFactor,
                            paddingHorizontal: contentPadding,
                          }}
                          href={`${constants.API_BASE_URL}/github/app/manage`}
                          openOnNewTab
                          size={32 * scaleFactor}
                        >
                          <ThemedIcon
                            color={foregroundThemeColor}
                            family="octicon"
                            name="tools"
                            size={16 * scaleFactor}
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
                            width: 52 * scaleFactor,
                            paddingHorizontal: contentPadding,
                          }}
                          disabled={!!executingOAuth}
                          loading={executingOAuth === 'app'}
                          loadingIndicatorStyle={{
                            transform: [{ scale: 0.8 }],
                          }}
                          onPress={() => startOAuth('app')}
                          size={32 * scaleFactor}
                        >
                          <ThemedIcon
                            color={foregroundThemeColor}
                            family="octicon"
                            name={githubAppToken ? 'sync' : 'plus'}
                            size={16 * scaleFactor}
                          />
                        </Button>
                      )}
                    </>
                  </SubHeader>
                )}

                {!!githubAppToken && constants.ENABLE_GITHUB_APP_SUPPORT && (
                  <>
                    <View>
                      <SubHeader title="GitHub App installations">
                        <>
                          <Spacer flex={1} />

                          {!!(
                            githubAppToken ||
                            installationsLoadState === 'loading'
                          ) && (
                            <Button
                              analyticsLabel="refresh_installation"
                              contentContainerStyle={{
                                width: 52 * scaleFactor,
                                paddingHorizontal: contentPadding,
                              }}
                              disabled={installationsLoadState === 'loading'}
                              loading={installationsLoadState === 'loading'}
                              loadingIndicatorStyle={{
                                transform: [{ scale: 0.8 }],
                              }}
                              onPress={() => {
                                dispatch(
                                  actions.refreshInstallationsRequest({
                                    includeInstallationToken: true,
                                  }),
                                )
                              }}
                              size={32 * scaleFactor}
                            >
                              <ThemedIcon
                                color={foregroundThemeColor}
                                family="octicon"
                                name="sync"
                                size={16 * scaleFactor}
                              />
                            </Button>
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
                                  paddingTop:
                                    index === 0 ? 0 : contentPadding / 2,
                                  paddingHorizontal: contentPadding,
                                },
                              ]}
                            >
                              <Avatar
                                avatarUrl={
                                  installation.account.avatarUrl || undefined
                                }
                                username={installation.account.login}
                                linkURL={
                                  installation.account.htmlUrl || undefined
                                }
                                size={24 * scaleFactor}
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
                                  width: 52 * scaleFactor,
                                  paddingHorizontal: contentPadding,
                                }}
                                href={installation.htmlUrl}
                                openOnNewTab
                                size={32 * scaleFactor}
                              >
                                <ThemedIcon
                                  color={foregroundThemeColor}
                                  family="octicon"
                                  name="tools"
                                  size={16 * scaleFactor}
                                />
                              </ButtonLink>
                            </View>
                          ),
                      )}

                      <Spacer height={contentPadding / 2} />
                    </View>
                  </>
                )}

                <Spacer height={contentPadding / 2} />

                {Platform.OS === 'web' && (
                  <SubHeader title="Keyboard shortcuts">
                    <>
                      <Spacer flex={1} />

                      <Button
                        analyticsLabel="show_keyboard_shortcuts"
                        contentContainerStyle={{
                          width: 52 * scaleFactor,
                          paddingHorizontal: contentPadding,
                        }}
                        onPress={() =>
                          dispatch(
                            actions.pushModal({ name: 'KEYBOARD_SHORTCUTS' }),
                          )
                        }
                        size={32 * scaleFactor}
                      >
                        <ThemedIcon
                          family="octicon"
                          name="keyboard"
                          color={foregroundThemeColor}
                          size={16 * scaleFactor}
                        />
                      </Button>
                    </>
                  </SubHeader>
                )}
              </View>

              <Spacer flex={1} minHeight={contentPadding} />

              <View style={sharedStyles.paddingHorizontal}>
                <Spacer height={contentPadding} />

                <Button
                  key="delete-account-button"
                  analyticsAction="delete_account"
                  analyticsLabel="delete_account"
                  disabled={isDeletingAccount || isLoggingIn}
                  loading={isDeletingAccount}
                  onPress={() =>
                    Dialog.show(
                      'Delete Account?',
                      'All your columns and preferences will be lost.' +
                        ' If you login again, a new empty account will be created.',
                      [
                        {
                          onPress: () => {
                            dispatch(actions.deleteAccountRequest())
                          },
                          style: 'destructive',
                          text: 'Delete',
                        },
                        {
                          style: 'cancel',
                          text: 'Cancel',
                        },
                      ],
                    )
                  }
                  type="danger"
                >
                  Delete account
                </Button>

                <Spacer height={contentPadding / 2} />

                <Button
                  key="logout-button"
                  analyticsCategory="engagement"
                  analyticsAction="logout"
                  analyticsLabel=""
                  onPress={() => dispatch(actions.logout())}
                >
                  Logout
                </Button>
              </View>

              <Spacer height={contentPadding / 2} />
            </>
          )}
        </DialogConsumer>
      </ModalColumn>
    )
  },
)

AdvancedSettingsModal.displayName = 'AdvancedSettingsModal'
