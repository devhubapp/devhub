import React from 'react'
import { View } from 'react-native'

import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { useSafeArea } from '../../libs/safe-area-view'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { IconButton } from '../common/IconButton'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'

export function AppBannerMessage() {
  const safeAreaInsets = useSafeArea()

  const bannerMessage = useReduxState(selectors.bannerMessageSelector)
  const closeBannerMessage = useReduxAction(actions.closeBannerMessage)

  if (!(bannerMessage && bannerMessage.message)) return null

  return (
    <View
      style={[
        sharedStyles.fullWidth,
        {
          paddingTop: safeAreaInsets.top,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
      ]}
    >
      <View
        style={[
          sharedStyles.fullWidth,
          sharedStyles.horizontal,
          sharedStyles.alignItemsCenter,
        ]}
      >
        <Spacer width={contentPadding / 2} />
        <View style={{ width: 18 + contentPadding }} />
        <Spacer width={contentPadding / 2} />

        <View
          style={[
            sharedStyles.flex,
            sharedStyles.center,
            {
              paddingVertical: contentPadding,
              paddingHorizontal: contentPadding / 2,
            },
          ]}
        >
          <Link
            analyticsCategory="banner_link"
            analyticsLabel={bannerMessage.id}
            href={bannerMessage.href}
            openOnNewTab={bannerMessage.openOnNewTab}
            tooltip={undefined}
          >
            <ThemedText color="foregroundColor" style={sharedStyles.textCenter}>
              {parseTextWithEmojisToReactComponents(bannerMessage.message, {
                key: `banner-message-${bannerMessage.message}`,
                imageProps: {
                  style: {
                    width: 16,
                    height: 16,
                  },
                },
              })}
            </ThemedText>
          </Link>
        </View>

        <Spacer width={contentPadding / 2} />

        <IconButton
          name="x"
          onPress={() => closeBannerMessage(bannerMessage.id)}
          size={18}
          tooltip="Dismiss"
        />

        <Spacer width={contentPadding / 2} />
      </View>

      <CardItemSeparator />
    </View>
  )
}
