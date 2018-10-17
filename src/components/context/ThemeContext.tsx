import React from 'react'

import { theme as defaultTheme } from '../../styles/themes/dark-gray'
import { Theme } from '../../styles/utils'

export interface ThemeProviderProps {
  children?: React.ReactNode
  initialTheme?: Theme
}

export interface ThemeProviderState {
  setTheme: (theme: Theme) => void
  theme: Theme
}

const ThemeContext = React.createContext<ThemeProviderState>({
  setTheme: _theme => {
    throw new Error('[setTheme] Not implemented')
  },
  theme: defaultTheme,
})

export class ThemeProvider extends React.PureComponent<
  ThemeProviderProps,
  ThemeProviderState
> {
  static defaultProps = {
    initialTheme: defaultTheme,
  }

  constructor(props: any) {
    super(props)

    this.state = {
      setTheme: this.setTheme,
      theme: props.initialTheme || defaultTheme,
    }
  }

  setTheme = (theme: Theme) => {
    this.setState({ theme: theme || this.props.initialTheme || defaultTheme })
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

export const ThemeConsumer = ThemeContext.Consumer
