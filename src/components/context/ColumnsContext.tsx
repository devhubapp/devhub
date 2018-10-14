import React from 'react'
import { AsyncStorage } from 'react-native'

import { Column } from '../../types'

function getDefaultColumns(username: string): Column[] {
  return [
    {
      type: 'notifications',
      subtype: 'all',
    },
    {
      subtype: 'received_events',
      type: 'users',
      username,
    },
    {
      subtype: 'events',
      type: 'users',
      username,
    },
    {
      showAvatarAsIcon: true,
      subtype: 'events',
      type: 'orgs',
      username: 'facebook',
    },
    {
      repoIsKnown: true,
      showAvatarAsIcon: true,
      subtype: 'events',
      type: 'repos',
      username: 'facebook/react',
    },
  ]
}

export interface ColumnsProviderProps {
  children?: React.ReactNode
  username: string | null
}

export interface ColumnsProviderState {
  columns: Column[] | null
  hasLoadedFromCache: boolean
}

const defaultState = {
  columns: null,
  hasLoadedFromCache: false,
}

const ColumnsContext = React.createContext<ColumnsProviderState>(defaultState)

export class ColumnsProvider extends React.PureComponent<
  ColumnsProviderProps,
  ColumnsProviderState
> {
  constructor(props: any) {
    super(props)
    this.state = defaultState
  }

  async componentDidMount() {
    await this.updateFromCache()
  }

  componentDidUpdate(prevProps: ColumnsProviderProps) {
    if (this.props.username) {
      if (this.props.username !== prevProps.username) this.updateFromCache()
    } else {
      this.setState({ columns: null })
    }
  }

  updateFromCache = async () => {
    if (!this.props.username) return
    let columns = await this.getColumns()
    if (!columns) await this.setColumns(getDefaultColumns(this.props.username))
    columns = await this.getColumns()

    await new Promise(resolve =>
      this.setState({ columns, hasLoadedFromCache: true }, resolve),
    )
  }

  getColumns = async () => {
    if (!this.props.username) return null
    if (this.state.columns) return this.state.columns

    try {
      const _columnsStr = await AsyncStorage.getItem(
        `${this.props.username}_columns`,
      )
      const columns: Column[] | null = _columnsStr
        ? JSON.parse(_columnsStr)
        : null

      return columns
    } catch (e) {
      return null
    }
  }

  render() {
    return (
      <ColumnsContext.Provider value={this.state}>
        {this.props.children}
      </ColumnsContext.Provider>
    )
  }

  private setColumns = async (columns: Column[]) => {
    if (!this.props.username)
      throw new Error('[ColumnsContext][setColumns] No username specified.')

    await AsyncStorage.setItem(
      `${this.props.username}_columns`,
      JSON.stringify(columns),
    )
    await new Promise(resolve => this.setState({ columns }, resolve))
  }
}

export const ColumnsConsumer = ColumnsContext.Consumer
