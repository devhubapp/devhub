import React, { useContext, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export const APP_LAYOUT_BREAKPOINTS = {
  SMALL: 420,
  MEDIUM: 600,
  LARGE: 800,
  XLARGE: 1000,
}

export interface AppLayoutProviderProps {
  children?: React.ReactNode
}

export interface AppLayoutProviderState {
  appOrientation: 'landscape' | 'portrait'
  deviceOrientation: 'landscape' | 'portrait'
  sizename: '1-small' | '2-medium' | '3-large' | '4-x-large' | '5-xx-large'
}

export const AppLayoutContext = React.createContext<AppLayoutProviderState>(
  getLayoutConsumerState(),
)

export function AppLayoutProvider(props: AppLayoutProviderProps) {
  const [state, setState] = useState(() => getLayoutConsumerState())

  useEffect(() => {
    const handler = () => {
      setState(getLayoutConsumerState())
    }

    Dimensions.addEventListener('change', handler)
    return () => Dimensions.removeEventListener('change', handler)
  }, [])

  return (
    <AppLayoutContext.Provider value={state}>
      {props.children}
    </AppLayoutContext.Provider>
  )
}

export const AppLayoutConsumer = AppLayoutContext.Consumer

export function getLayoutConsumerState(): AppLayoutProviderState {
  const { width, height } = Dimensions.get('window')

  const sizename: AppLayoutProviderState['sizename'] =
    width <= APP_LAYOUT_BREAKPOINTS.SMALL
      ? '1-small'
      : width <= APP_LAYOUT_BREAKPOINTS.MEDIUM
      ? '2-medium'
      : width <= APP_LAYOUT_BREAKPOINTS.LARGE
      ? '3-large'
      : width <= APP_LAYOUT_BREAKPOINTS.XLARGE
      ? '4-x-large'
      : '5-xx-large'

  const deviceOrientation = width > height ? 'landscape' : 'portrait'
  const appOrientation =
    deviceOrientation === 'landscape' || sizename >= '3-large'
      ? 'landscape'
      : 'portrait'

  return { appOrientation, deviceOrientation, sizename }
}

export function useAppLayout() {
  return useContext(AppLayoutContext)
}
