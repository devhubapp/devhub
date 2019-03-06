import React, { useRef } from 'react'
import { View } from 'react-native'

import { Theme } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { darkThemesArr, lightThemesArr } from '../../styles/themes'
import { defaultTheme } from '../../styles/utils'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedCheckbox } from '../common/Checkbox'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { Switch } from '../common/Switch'
import { TouchableOpacity } from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'

export const ThemePreference = React.memo(() => {
  const lastThemeId = useRef(defaultTheme.id)

  useTheme(theme => {
    if (theme.id === 'auto') return
    lastThemeId.current = theme.id
  })

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const currentThemeId = useReduxState(selectors.themePairSelector).id

  const preferredDarkTheme = useReduxState(
    selectors.preferredDarkThemePairSelector,
  )
  const preferredLightTheme = useReduxState(
    selectors.preferredLightThemePairSelector,
  )

  const setTheme = useReduxAction(actions.setTheme)

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
      <SpringAnimatedCheckbox
        analyticsLabel={undefined}
        key={`theme-item-checkbox-${theme.id}`}
        checked={selected ? (currentThemeId === 'auto' ? null : true) : false}
        circle
        containerStyle={{
          marginBottom: contentPadding / 2,
        }}
        enableIndeterminateState={currentThemeId === 'auto'}
        label={theme.displayName}
        onChange={checked => {
          if (
            checked === true ||
            (currentThemeId === 'auto' && checked === null)
          ) {
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
    </View>
  )
})
