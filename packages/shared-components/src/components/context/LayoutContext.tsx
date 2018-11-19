import React from 'react'
import { Dimensions } from 'react-native'

export const LAYOUT_BREAKPOINTS = {
  SMALL: 420,
}

export interface LayoutProviderProps {
  children?: React.ReactNode
}

export interface LayoutProviderState {
  appOrientation: 'landscape' | 'portrait'
  deviceOrientation: 'landscape' | 'portrait'
  sizename: '1-small' | '2-large'
}

const LayoutContext = React.createContext<LayoutProviderState>(
  getLayoutConsumerState(),
)

export class LayoutProvider extends React.PureComponent<
  LayoutProviderProps,
  LayoutProviderState
> {
  constructor(props: any) {
    super(props)
    this.state = getLayoutConsumerState()
  }

  updateDimensions = () => {
    this.setState(getLayoutConsumerState())
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateDimensions)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateDimensions)
  }

  render() {
    return (
      <LayoutContext.Provider value={this.state}>
        {this.props.children}
      </LayoutContext.Provider>
    )
  }
}

export const LayoutConsumer = LayoutContext.Consumer

export function getLayoutConsumerState(): LayoutProviderState {
  const { width, height } = Dimensions.get('window')

  const sizename: LayoutProviderState['sizename'] =
    width <= LAYOUT_BREAKPOINTS.SMALL ? '1-small' : '2-large'

  const deviceOrientation = width > height ? 'landscape' : 'portrait'
  const appOrientation =
    deviceOrientation === 'landscape' || sizename === '2-large'
      ? 'landscape'
      : 'portrait'

  return { appOrientation, deviceOrientation, sizename }
}
