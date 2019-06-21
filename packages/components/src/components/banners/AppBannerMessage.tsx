import React from 'react'
import { View } from 'react-native'

import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { SafeAreaView } from '../../libs/safe-area-view'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'

export function AppBannerMessage() {
  const bannerMessage = useReduxState(selectors.bannerMessageSelector)
  const closeBannerMessage = useReduxAction(actions.closeBannerMessage)

  if (!(bannerMessage && bannerMessage.message)) return null

  return (
    <SafeAreaView style={{ width: '100%' }}>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <Spacer width={contentPadding / 2} />
        <View style={{ width: 18 + contentPadding }} />
        <Spacer width={contentPadding / 2} />

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            paddingVertical: contentPadding,
            paddingHorizontal: contentPadding / 2,
          }}
        >
          <Link
            analyticsCategory="banner_link"
            analyticsLabel={bannerMessage.id}
            href={bannerMessage.href}
            openOnNewTab={bannerMessage.openOnNewTab}
            tooltip={undefined}
          >
            <ThemedText color="foregroundColor" style={{ textAlign: 'center' }}>
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

        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            width: 18 + contentPadding,
          }}
        >
          <ColumnHeaderItem
            iconName="x"
            noPadding
            onPress={() => closeBannerMessage(bannerMessage.id)}
            size={18}
            tooltip="Dismiss"
          />

          <Spacer width={contentPadding / 2} />
        </View>
      </View>

      <CardItemSeparator />
    </SafeAreaView>
  )
}
