import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Switch,
  Text,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'

import { ThemeConsumer } from '../../components/context/ThemeContext'
import {
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  themePairSelector,
} from '../../redux/selectors'
import { themes } from '../../styles/themes'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector, Theme } from '../../types'
import { Spacer } from '../common/Spacer'

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
    const _themesArr = Object.values(themes).filter(Boolean) as Theme[]
    const darkThemesArr = _themesArr.filter(theme => theme.isDark)
    const lightThemesArr = _themesArr.filter(theme => !theme.isDark)

    const H3 = ({
      children,
      style,
      ...props
    }: TextProps & { children: string }) => (
      <Text
        {...props}
        style={[
          {
            marginBottom: contentPadding / 2,
            fontWeight: '500',
          },
          style,
        ]}
      >
        {typeof children === 'string' ? children.toUpperCase() : children}
      </Text>
    )

    return (
      <ThemeConsumer>
        {({ theme: appTheme }) => (
          <View>
            <H3 style={{ color: appTheme.foregroundColor }}>Dark Theme</H3>
            <Spacer height={contentPadding / 2} />
            {darkThemesArr.map(t => this.renderThemeButton(t, appTheme))}

            <Spacer height={contentPadding} />

            <H3 style={{ color: appTheme.foregroundColor }}>Light Theme</H3>
            <Spacer height={contentPadding / 2} />
            {lightThemesArr.map(t => this.renderThemeButton(t, appTheme))}

            <Spacer height={contentPadding} />

            <H3 style={{ color: appTheme.foregroundColor }}>
              Auto toggle on day/night
            </H3>
            <Spacer height={contentPadding / 2} />
            <Switch
              value={this.props.currentThemeId === 'auto'}
              onValueChange={enableAutoTheme =>
                this.props.setTheme({
                  id: enableAutoTheme ? 'auto' : appTheme.id,
                })
              }
            />
          </View>
        )}
      </ThemeConsumer>
    )
  }
}

export const ThemePreference = connectToStore(ThemePreferenceComponent)
