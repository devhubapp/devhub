import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'

import { ThemeConsumer } from '../../components/context/ThemeContext'
import {
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  themePairSelector,
} from '../../redux/selectors'
import { darkThemesArr, lightThemesArr, themes } from '../../styles/themes'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector, Theme } from '../../types'
import { H2 } from '../common/H2'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { Switch } from '../common/Switch'

export interface ThemePreferenceProps {}

const connectToStore = connect(
  (state: any) => {
    const theme = themePairSelector(state)
    const preferredDarkTheme = preferredDarkThemePairSelector(state)
    const preferredLightTheme = preferredLightThemePairSelector(state)

    return {
      currentThemeId: theme && theme.id,
      preferredDarkTheme: preferredDarkTheme && preferredDarkTheme.id,
      preferredLightTheme: preferredLightTheme && preferredLightTheme.id,
    }
  },
  {
    logout: actions.logout,
    setPreferrableTheme: actions.setPreferrableTheme,
    setTheme: actions.setTheme,
  },
)

class ThemePreferenceComponent extends PureComponent<
  ThemePreferenceProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  logout = () => {
    this.props.logout()
  }

  renderThemeButton = (theme: Theme, appTheme: Theme) => {
    const {
      currentThemeId,
      preferredDarkTheme,
      preferredLightTheme,
    } = this.props
    const selected =
      currentThemeId === theme.id ||
      (currentThemeId === 'auto' &&
        (theme.isDark
          ? theme.id === preferredDarkTheme
          : theme.id === preferredLightTheme))

    return (
      <TouchableOpacity
        key={`theme-button-${theme.id}`}
        onPress={() => {
          if (currentThemeId === 'auto') {
            this.props.setPreferrableTheme({
              id: theme.id,
              color: theme.backgroundColor,
            })
          } else {
            this.props.setTheme({
              id: theme.id,
              color: theme.backgroundColor,
            })
          }
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
              justifyContent: 'center',
              marginRight: contentPadding / 2,
              width: 32,
              height: 32,
              borderRadius: 32 / 2,
              backgroundColor: theme.backgroundColor,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.foregroundColorMuted50,
            }}
          >
            <Text
              style={{
                width: '100%',
                margin: 0,
                padding: 0,
                fontWeight: '500',
                fontSize: 13,
                lineHeight: 32,
                color: theme.foregroundColorMuted50,
                textAlign: 'center',
              }}
            >
              {selected &&
                (currentThemeId === 'auto' ? (theme.isDark ? '◓' : '◒') : '●')}
            </Text>
          </View>

          <Text style={{ color: appTheme.foregroundColor }}>
            {theme.displayName}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <ThemeConsumer>
        {({ theme: appTheme }) => (
          <View>
            <H2 withMargin>Theme</H2>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <H3 withMargin>Dark Theme</H3>
                {darkThemesArr.map(t => this.renderThemeButton(t, appTheme))}
              </View>

              <View style={{ flex: 1 }}>
                <H3 withMargin>Light Theme</H3>
                {lightThemesArr.map(t => this.renderThemeButton(t, appTheme))}
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
                onValueChange={enableAutoTheme =>
                  this.props.setTheme({
                    id: enableAutoTheme ? 'auto' : appTheme.id,
                  })
                }
                value={this.props.currentThemeId === 'auto'}
              />
            </View>
          </View>
        )}
      </ThemeConsumer>
    )
  }
}

export const ThemePreference = connectToStore(ThemePreferenceComponent)
