import React, { useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Store } from 'redux'

import { RootState } from '../types'

export interface ReduxStoreProviderProps {
  children: React.ReactNode
}

export type ReduxStoreProviderState = Store<RootState>

export const ReduxStoreContext = React.createContext<ReduxStoreProviderState>(
  undefined as any,
)

export function ReduxStoreProvider(props: ReduxStoreProviderProps) {
  const { store } = useContext(ReactReduxContext)

  return <ReduxStoreContext.Provider {...props} value={store} />
}

export const ReduxStoreConsumer = ReduxStoreContext.Consumer
