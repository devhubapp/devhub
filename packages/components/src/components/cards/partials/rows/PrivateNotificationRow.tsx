import React from 'react'
import { View } from 'react-native'

import { constants } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { cardRowStyles } from './styles'

export interface PrivateNotificationRowProps {
  isRead?: boolean
  ownerId?: number | string | undefined
  repoId?: number | string | undefined
  smallLeftColumn?: boolean
}

export const PrivateNotificationRow = React.memo(
  (props: PrivateNotificationRowProps) => {
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const { ownerId, repoId, smallLeftColumn } = props

    return (
      <View style={cardRowStyles.container}>
        <View
          style={[
            cardStyles.leftColumn,
            smallLeftColumn
              ? cardStyles.leftColumn__small
              : cardStyles.leftColumn__big,
            cardStyles.leftColumnAlignTop,
          ]}
        />

        <View style={cardStyles.rightColumn}>
          <Link
            analyticsLabel="setup_github_app_from_private_notification"
            href={
              ownerId
                ? `https://github.com/apps/${
                    constants.GITHUB_APP_CANNONICAL_ID
                  }/installations/new/permissions?suggested_target_id=${ownerId}&repository_ids[]=${repoId ||
                    ''}`
                : `https://github.com/apps/${
                    constants.GITHUB_APP_CANNONICAL_ID
                  }/installations/new`
            }
            openOnNewTab={false}
            style={cardRowStyles.mainContentContainer}
          >
            <SpringAnimatedText
              style={[
                getCardStylesForTheme(springAnimatedTheme).commentText,
                getCardStylesForTheme(springAnimatedTheme).mutedText,
                { fontStyle: 'italic' },
              ]}
            >
              Install the GitHub App to unlock details from private
              notifications.
            </SpringAnimatedText>
          </Link>
        </View>
      </View>
    )
  },
)
