import React from 'react'
import { AsyncStorage } from 'react-native'

import { Column } from '../../types'

function getDefaultColumns(username: string): Column[] {
  return [
    {
      type: 'notifications',
      params: {
        all: true,
      },
    },
    {
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
      params: {
        username,
      },
    },
    {
      type: 'activity',
      subtype: 'USER_EVENTS',
      params: {
        username,
      },
    },
    {
      type: 'activity',
      subtype: 'ORG_PUBLIC_EVENTS',
      params: {
        org: 'facebook',
      },
    },
    {
      type: 'activity',
      subtype: 'REPO_EVENTS',
      params: {
        owner: 'facebook',
        repo: 'react',
      },
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

  getStorageKey = () => `${this.props.username}_columns_v2`

  getColumns = async () => {
    if (!this.props.username) return null
    if (this.state.columns) return this.state.columns

    try {
      const _columnsStr = await AsyncStorage.getItem(this.getStorageKey())
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

    await AsyncStorage.setItem(this.getStorageKey(), JSON.stringify(columns))
    await new Promise(resolve => this.setState({ columns }, resolve))
  }
}

export const ColumnsConsumer = ColumnsContext.Consumer
