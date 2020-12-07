import _ from 'lodash'
import React, { useEffect } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { constants } from '@devhub/core'
import logo from '@devhub/components/assets/logo_circle.png'

import { getAppVersionLabel } from '../components/common/AppVersion'
import { FullHeightScrollView } from '../components/common/FullHeightScrollView'
import { GitHubLoginButton } from '../components/common/GitHubLoginButton'
import { Link } from '../components/common/Link'
import { Screen } from '../components/common/Screen'
import { Spacer } from '../components/common/Spacer'
import { ThemedText } from '../components/themed/ThemedText'
import { useDimensions } from '../hooks/use-dimensions'
import { useLoginHelpers } from '../components/context/LoginHelpersContext'
import { analytics } from '../libs/analytics'
import { Platform } from '../libs/platform'
import { sharedStyles } from '../styles/shared'
import {
  contentPadding,
  normalTextSize,
  scaleFactor,
  smallerTextSize,
} from '../styles/variables'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },

  contentContainer: {
    alignItems: 'stretch',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: contentPadding,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    height: normalTextSize * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    alignSelf: 'center',
    height: 80 * scaleFactor,
    marginBottom: contentPadding / 2,
    width: 80 * scaleFactor,
  },

  title: {
    fontSize: 30 * scaleFactor,
    fontWeight: 'bold',
    lineHeight: 36 * scaleFactor,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: normalTextSize + 2 * scaleFactor,
    fontWeight: '400',
    lineHeight: normalTextSize + 4 * scaleFactor,
    textAlign: 'center',
  },

  button: {
    alignSelf: 'stretch',
    marginTop: contentPadding / 2,
  },

  footerLink: {},

  footerLinkText: {
    fontSize: normalTextSize,
    lineHeight: normalTextSize * 1.5,
    textAlign: 'center',
  },

  footerSeparatorText: {
    paddingHorizontal: contentPadding / 2,
    fontStyle: 'italic',
  },
})

export const LoginScreen = React.memo(() => {
  const dimensions = useDimensions('width')

  const {
    loginWithGitHub,
    loginWithGitHubPersonalAccessToken,
    isLoggingIn,
    fullAccessRef,
    isExecutingOAuth,
  } = useLoginHelpers()

  useEffect(() => {
    analytics.trackScreenView('LOGIN_SCREEN')
  }, [])

  const hasMultipleLoginButtons =
    constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON ||
    constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON

  return (
    <Screen>
      <FullHeightScrollView
        alwaysBounceVertical={false}
        style={[
          styles.container,
          { maxWidth: Math.min(400 * scaleFactor, dimensions.width) },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header} />

        <View style={styles.mainContentContainer}>
          <Spacer height={contentPadding} />

          <Link
            analyticsCategory="loginscreen"
            analyticsLabel="logo"
            href={constants.DEVHUB_LINKS.GITHUB_REPOSITORY}
            openOnNewTab
            style={styles.footerLink}
            textProps={{
              color: 'foregroundColorMuted65',
              style: styles.footerLinkText,
            }}
          >
            <Image resizeMode="contain" source={logo} style={styles.logo} />
          </Link>

          <Spacer height={contentPadding} />

          <ThemedText color="foregroundColor" style={styles.title}>
            Welcome to DevHub
          </ThemedText>

          <Spacer height={contentPadding / 2} />

          <ThemedText color="foregroundColorMuted65" style={styles.subtitle}>
            GitHub Notifications & Activities on your Desktop
          </ThemedText>

          <Spacer height={contentPadding * 2} />

          {!Platform.isMacOS &&
            (() => {
              const subtitle = hasMultipleLoginButtons
                ? 'Granular permissions'
                : undefined

              return (
                <GitHubLoginButton
                  analyticsLabel="github_login_public"
                  disabled={isLoggingIn || isExecutingOAuth}
                  loading={
                    !fullAccessRef.current && (isLoggingIn || isExecutingOAuth)
                  }
                  onPress={() => {
                    void loginWithGitHub()
                  }}
                  // rightIcon={{ family: 'octicon', name: 'globe' }}
                  style={styles.button}
                  subtitle={subtitle}
                  textProps={{
                    style: {
                      textAlign:
                        hasMultipleLoginButtons || subtitle ? 'left' : 'center',
                    },
                  }}
                  title="Sign in with GitHub"
                />
              )
            })()}

          {!!constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON && (
            <>
              <Spacer height={contentPadding / 2} />

              <GitHubLoginButton
                analyticsLabel="github_login_private"
                disabled={isLoggingIn || isExecutingOAuth}
                loading={
                  !!(fullAccessRef.current && (isLoggingIn || isExecutingOAuth))
                }
                onPress={() => {
                  void loginWithGitHub({ fullAccess: true })
                }}
                // rightIcon={{ family: 'octicon', name: 'lock' }}
                style={styles.button}
                subtitle="Full access"
                textProps={{
                  style: {
                    textAlign: hasMultipleLoginButtons ? 'left' : 'center',
                  },
                }}
                title="Sign in with GitHub"
                type="neutral"
              />
            </>
          )}

          {!!(
            constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON ||
            Platform.isMacOS
          ) && (
            <>
              <Spacer height={contentPadding / 2} />

              <GitHubLoginButton
                analyticsLabel="github_login_personal"
                disabled={isLoggingIn || isExecutingOAuth}
                loading={
                  fullAccessRef.current && (isLoggingIn || isExecutingOAuth)
                }
                onPress={() => {
                  fullAccessRef.current = true
                  void loginWithGitHubPersonalAccessToken()
                }}
                // rightIcon={{ family: 'octicon', name: 'key' }}
                style={styles.button}
                subtitle="Personal token"
                title="Sign in with GitHub"
                textProps={{
                  style: {
                    textAlign: hasMultipleLoginButtons ? 'left' : 'center',
                  },
                }}
                type={Platform.isMacOS ? 'primary' : 'neutral'}
              />
            </>
          )}

          {!Platform.isMacOS &&
            !!(
              constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON ||
              constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON
            ) && (
              <>
                <Spacer height={contentPadding} />

                <ThemedText
                  color="foregroundColorMuted65"
                  style={[
                    sharedStyles.textCenter,
                    { fontSize: smallerTextSize, fontStyle: 'italic' },
                  ]}
                >
                  {`"Granular permissions" is recommended, but feel free to use the ${[
                    constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON &&
                      '"Full access"',
                    constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON &&
                      '"Personal token"',
                  ]
                    .filter(Boolean)
                    .join(
                      ' or ',
                    )} option to easily get access to all private repositories you have access.`}
                </ThemedText>
              </>
            )}
        </View>

        <Spacer height={contentPadding} />

        <View style={styles.footer}>
          <ScrollView horizontal>
            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="twitter"
              href={constants.DEVHUB_LINKS.TWITTER_PROFILE}
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted65',
                style: styles.footerLinkText,
              }}
            >
              Twitter
            </Link>

            <ThemedText
              color="foregroundColorMuted25"
              style={styles.footerSeparatorText}
            >
              |
            </ThemedText>

            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="github"
              href={constants.DEVHUB_LINKS.GITHUB_REPOSITORY}
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted65',
                style: styles.footerLinkText,
              }}
            >
              GitHub
            </Link>

            <ThemedText
              color="foregroundColorMuted25"
              style={styles.footerSeparatorText}
            >
              |
            </ThemedText>

            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="app_version"
              href={`${constants.DEVHUB_LINKS.GITHUB_REPOSITORY}/releases`}
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted65',
                style: styles.footerLinkText,
              }}
            >
              {getAppVersionLabel()}
            </Link>
          </ScrollView>
        </View>
      </FullHeightScrollView>
    </Screen>
  )
})

LoginScreen.displayName = 'LoginScreen'
