import React, { useRef } from 'react'
import { View } from 'react-native'

import { darkThemesArr, isNight, lightThemesArr, Theme } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Appearance } from '../../libs/appearence'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { vibrateHapticFeedback } from '../../utils/helpers/shared'
import { Checkbox } from '../common/Checkbox'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { Switch } from '../common/Switch'
import { useTheme } from '../context/ThemeContext'

export const ThemePreference = React.memo(() => {
  const appTheme = useTheme()

  const lastThemeId = useRef(appTheme.id)
  if (appTheme.id !== 'auto') lastThemeId.current = appTheme.id

  const currentThemeId = useReduxState(selectors.themePairSelector).id

  const preferredDarkTheme = useReduxState(
    selectors.preferredDarkThemePairSelector,
  )
  const preferredLightTheme = useReduxState(
    selectors.preferredLightThemePairSelector,
  )

  const setTheme = useReduxAction(actions.setTheme)
  const setPreferrableTheme = useReduxAction(actions.setPreferrableTheme)

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
      <Checkbox
        key={`theme-item-checkbox-${theme.id}`}
        checked={selected ? (currentThemeId === 'auto' ? null : true) : false}
        circle
        containerStyle={{
          marginBottom: contentPadding / 2,
        }}
        enableIndeterminateState={currentThemeId === 'auto'}
        label={theme.displayName}
        onChange={(checked) => {
          if (
            typeof checked === 'boolean' ||
            (currentThemeId === 'auto' && checked === null)
          ) {
            if (
              currentThemeId === 'auto' &&
              theme.isDark ===
                (Appearance.getColorScheme() === 'dark' ||
                  (Appearance.getColorScheme() !== 'light' && isNight()))
            ) {
              setPreferrableTheme({
                id: theme.id,
                color: theme.backgroundColor,
              })
              return
            }

            vibrateHapticFeedback()

            setTheme({
              id: theme.id,
              color: theme.backgroundColor,
            })
          }
        }}
      />
    )
  }

  return (
    <View>
      <SubHeader title="Theme" />

      <View style={{ paddingHorizontal: contentPadding }}>
        <View style={sharedStyles.horizontal}>
          <View style={sharedStyles.flex}>
            <H3 withMargin>Light Theme</H3>
            {lightThemesArr.map((t) => renderThemeButton(t))}
          </View>

          <View style={sharedStyles.flex}>
            <H3 withMargin>Dark Theme</H3>
            {darkThemesArr.map((t) => renderThemeButton(t))}
          </View>
        </View>

        <Spacer height={contentPadding} />

        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.alignItemsCenter,
            sharedStyles.justifyContentSpaceBetween,
          ]}
        >
          <H3>Auto detect system preference</H3>
          <Switch
            analyticsLabel="auto_theme"
            onValueChange={(enableAutoTheme) =>
              setTheme({
                id: enableAutoTheme ? 'auto' : lastThemeId.current,
              })
            }
            value={currentThemeId === 'auto'}
          />
        </View>
      </View>
    </View>
  )
})

ThemePreference.displayName = 'ThemePreference'
