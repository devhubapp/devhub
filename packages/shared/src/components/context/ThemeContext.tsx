import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import { defaultThemePair, themeSelector } from '../../redux/selectors/config'
import { loadTheme } from '../../styles/utils'
import { ExtractDispatcherFromActionCreator, Theme } from '../../types'
import { ExtractPropsFromConnector } from '../../types/redux'

export interface ThemeProviderProps {
  children?: React.ReactNode
}

export interface ThemeProviderState {
  setTheme: ExtractDispatcherFromActionCreator<typeof actions.setTheme>
  theme: Theme
}

const defaultTheme = loadTheme(defaultThemePair)

export const ThemeContext = React.createContext<ThemeProviderState>({
  setTheme: () => {
    throw new Error('[setTheme] Not implemented')
  },
  theme: defaultTheme,
})

export const ThemeConsumer = ThemeContext.Consumer

const connectToStore = connect((state: any) => ({
  theme: themeSelector(state),
}))

type Props = ThemeProviderProps &
  ExtractPropsFromConnector<typeof connectToStore>
class ThemeProviderComponent extends React.PureComponent<
  Props,
  ThemeProviderState
> {
  constructor(props: Props) {
    super(props)

    this.state = {
      setTheme: this.setTheme,
      theme: props.theme || defaultTheme,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.theme !== prevProps.theme)
      this.setState({ theme: this.props.theme })
  }

  setTheme: ThemeProviderState['setTheme'] = payload => {
    this.props.dispatch({ type: 'SET_THEME', payload })
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

export const ThemeProvider = connectToStore(ThemeProviderComponent)
