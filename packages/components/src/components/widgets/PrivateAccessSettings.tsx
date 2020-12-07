import React from 'react'
import { View } from 'react-native'

import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, scaleFactor } from '../../styles/variables'
import { Button, getButtonColors } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { useLoginHelpers } from '../context/LoginHelpersContext'

export type PrivateAccessSettingsProps = {}

export const PrivateAccessSettings = React.memo<PrivateAccessSettingsProps>(
  () => {
    const {
      addPersonalAccessToken,
      isLoggingIn,
      patLoadingState,
      removePersonalAccessToken,
    } = useLoginHelpers()

    const githubPersonalTokenDetails = useReduxState(
      selectors.githubPersonalTokenDetailsSelector,
    )

    const { foregroundThemeColor } = getButtonColors()

    return (
      <View>
        <SubHeader title="Personal Access Token">
          <Spacer flex={1} />

          {!!githubPersonalTokenDetails?.token ? (
            <Button
              analyticsLabel="remove_personal_access_token"
              contentContainerStyle={{
                width: 52 * scaleFactor,
                paddingHorizontal: contentPadding,
              }}
              disabled={patLoadingState === 'removing'}
              loading={patLoadingState === 'removing'}
              onPress={() => {
                void removePersonalAccessToken()
              }}
              size={32 * scaleFactor}
              type="danger"
            >
              <ThemedIcon
                color={foregroundThemeColor}
                family="octicon"
                name="trashcan"
                size={16 * scaleFactor}
              />
            </Button>
          ) : (
            <Button
              analyticsLabel="add_personal_access_token"
              contentContainerStyle={{
                width: 52 * scaleFactor,
                paddingHorizontal: contentPadding,
              }}
              disabled={patLoadingState === 'adding' || isLoggingIn}
              loading={patLoadingState === 'adding' || isLoggingIn}
              onPress={() => {
                void addPersonalAccessToken()
              }}
              size={32 * scaleFactor}
            >
              <ThemedIcon
                color={foregroundThemeColor}
                family="octicon"
                name="plus"
                size={16 * scaleFactor}
              />
            </Button>
          )}
        </SubHeader>

        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.alignItemsCenter,
            sharedStyles.paddingHorizontal,
          ]}
        >
          {githubPersonalTokenDetails?.token ? (
            <ThemedText
              color="foregroundColorMuted65"
              style={sharedStyles.flex}
            >
              {new Array(githubPersonalTokenDetails.token.length)
                .fill('*')
                .join('')}
            </ThemedText>
          ) : (
            <ThemedText
              color="foregroundColorMuted65"
              style={[sharedStyles.flex, { fontStyle: 'italic' }]}
            >
              Useful to get private repo support
            </ThemedText>
          )}
        </View>

        <Spacer height={contentPadding} />
      </View>
    )
  },
)

PrivateAccessSettings.displayName = 'PrivateAccessSettings'
