import React from 'react'
import { View } from 'react-native'

import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { useSpringAnimatedTheme } from '../context/SpringAnimatedThemeContext'

export function AppBannerMessage() {
  const springAnimatedTheme = useSpringAnimatedTheme()

  const bannerMessage = useReduxState(selectors.bannerMessageSelector)
  const closeBannerMessage = useReduxAction(actions.closeBannerMessage)

  if (!(bannerMessage && bannerMessage.message)) return null

  return (
    <View style={{ width: '100%' }}>
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
            analyticsLabel={bannerMessage.id.replace(/-/g, '_')}
            href={bannerMessage.href}
            openOnNewTab={bannerMessage.openOnNewTab}
          >
            <SpringAnimatedText
              style={{
                color: springAnimatedTheme.foregroundColor,
                textAlign: 'center',
              }}
            >
              {parseTextWithEmojisToReactComponents(bannerMessage.message, {
                key: `banner-message-${bannerMessage.message}`,
                imageProps: {
                  style: {
                    width: 14,
                    height: 14,
                  },
                },
              })}
            </SpringAnimatedText>
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
          />

          <Spacer width={contentPadding / 2} />
        </View>
      </View>

      <CardItemSeparator />
    </View>
  )
}
