import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import { Theme } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import * as colors from '../../styles/colors'
import { darkThemesArr, lightThemesArr } from '../../styles/themes'
import { contentPadding } from '../../styles/variables'
import { AnimatedText } from '../animated/AnimatedText'
import { H2 } from '../common/H2'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { Switch } from '../common/Switch'
import { TouchableOpacity } from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'

export function ThemePreference() {
  const appTheme = useTheme()
  const appAnimatedTheme = useAnimatedTheme()

  const currentThemeId = useReduxState(selectors.themePairSelector).id
  const preferredDarkTheme = useReduxState(
    selectors.preferredDarkThemePairSelector,
  )
  const preferredLightTheme = useReduxState(
    selectors.preferredLightThemePairSelector,
  )

  const setTheme = useReduxAction(actions.setTheme)

  const lastThemeId = useRef(appTheme.id)

  useEffect(
    () => {
      if (currentThemeId === 'auto') return
      lastThemeId.current = currentThemeId
    },
    [appTheme.id],
  )

  const preferredDarkThemeId = preferredDarkTheme && preferredDarkTheme.id
  const preferredLightThemeId = preferredLightTheme && preferredLightTheme.id

  const renderThemeButton = (theme: Theme) => {
    const selected =
      currentThemeId === theme.id ||
      (currentThemeId === 'auto' &&
        (theme.isDark
          ? theme.id === preferredDarkThemeId
          : theme.id === preferredLightThemeId))

    return (
      <TouchableOpacity
        analyticsLabel={undefined}
        key={`theme-button-${theme.id}`}
        onPress={() => {
          setTheme({
            id: theme.id,
            color: theme.backgroundColor,
          })
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: contentPadding / 2,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              marginRight: contentPadding / 2,
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
              borderWidth: 0,
              borderColor: 'transparent',
            }}
          >
            <AnimatedText
              style={{
                alignSelf: 'center',
                margin: 0,
                padding: 0,
                fontWeight: '500',
                ...Platform.select({
                  android: {
                    height: 20,
                    marginTop: -1,
                    fontFamily: 'monospace',
                    fontSize: 30,
                    lineHeight: 30,
                  },
                  default: {
                    fontSize: 20,
                    lineHeight: 20,
                  },
                }),
                color: selected
                  ? colors.brandBackgroundColor
                  : appTheme.foregroundColorTransparent80,
                textAlign: 'center',
              }}
            >
              {selected
                ? currentThemeId === 'auto'
                  ? theme.isDark
                    ? '◒'
                    : '◓'
                  : '◉'
                : '○'}
            </AnimatedText>
          </View>

          <AnimatedText
            style={{
              alignSelf: 'center',
              lineHeight: 20,
              color: selected
                ? colors.brandBackgroundColor
                : appAnimatedTheme.foregroundColor,
            }}
          >
            {theme.displayName}
          </AnimatedText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <H2 withMargin>Theme</H2>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <H3 withMargin>Light Theme</H3>
          {lightThemesArr.map(t => renderThemeButton(t))}
        </View>

        <View style={{ flex: 1 }}>
          <H3 withMargin>Dark Theme</H3>
          {darkThemesArr.map(t => renderThemeButton(t))}
        </View>
      </View>

      <Spacer height={contentPadding} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <H3>Auto toggle on day/night</H3>
        <Switch
          analyticsLabel="auto_theme"
          onValueChange={enableAutoTheme =>
            setTheme({
              id: enableAutoTheme ? 'auto' : lastThemeId.current,
            })
          }
          value={currentThemeId === 'auto'}
        />
      </View>
    </View>
  )
}
