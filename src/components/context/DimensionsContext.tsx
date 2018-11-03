import React from 'react'
import { Dimensions } from 'react-native'

export interface DimensionsProviderProps {
  children?: React.ReactNode
}

export interface DimensionsProviderState {
  width: number
  height: number
}

const DimensionsContext = React.createContext<DimensionsProviderState>({
  width: 0,
  height: 0,
})

export class DimensionsProvider extends React.PureComponent<
  DimensionsProviderProps,
  DimensionsProviderState
> {
  constructor(props: any) {
    super(props)
    this.state = this.getDimensions()
  }

  getDimensions() {
    const { width, height } = Dimensions.get('window')
    return { width, height }
  }

  updateDimensions = () => {
    this.setState(this.getDimensions())
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateDimensions)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateDimensions)
  }

  render() {
    return (
      <DimensionsContext.Provider value={this.state}>
        {this.props.children}
      </DimensionsContext.Provider>
    )
  }
}

export const DimensionsConsumer = DimensionsContext.Consumer
