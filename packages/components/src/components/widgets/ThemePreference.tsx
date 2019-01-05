import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { Theme } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { darkThemesArr, lightThemesArr } from '../../styles/themes'
import { contentPadding } from '../../styles/variables'
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
              borderWidth: 1,
              borderColor: appTheme.backgroundColorDarker08,
            }}
          >
            <Animated.Text
              style={{
                alignSelf: 'center',
                margin: 0,
                padding: 0,
                fontWeight: '500',
                fontSize: 10,
                lineHeight: 10,
                color: appTheme.foregroundColorTransparent80,
                textAlign: 'center',
              }}
            >
              {selected &&
                (currentThemeId === 'auto' ? (theme.isDark ? '◒' : '◓') : '●')}
            </Animated.Text>
          </View>

          <Animated.Text style={{ color: appAnimatedTheme.foregroundColor }}>
            {theme.displayName}
          </Animated.Text>
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
