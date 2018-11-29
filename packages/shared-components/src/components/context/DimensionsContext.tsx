import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

export interface DimensionsProviderProps {
  children?: React.ReactNode
}

export interface DimensionsProviderState {
  width: number
  height: number
}

export const DimensionsContext = React.createContext<DimensionsProviderState>({
  width: 0,
  height: 0,
})

function getDimensions() {
  const { width, height } = Dimensions.get('window')
  return { width, height }
}

export function DimensionsProvider(props: DimensionsProviderProps) {
  const [dimensions, setDimensions] = useState<DimensionsProviderState>(
    getDimensions(),
  )

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      setDimensions(window)
    }

    Dimensions.addEventListener('change', handler)
    return () => Dimensions.removeEventListener('change', handler)
  }, [])

  return (
    <DimensionsContext.Provider value={dimensions}>
      {props.children}
    </DimensionsContext.Provider>
  )
}

export const DimensionsConsumer = DimensionsContext.Consumer

export function useDimensions() {
  return useContext(DimensionsContext)
}
