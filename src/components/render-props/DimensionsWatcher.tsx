import { PureComponent, ReactNode } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

export interface IProps {
  children: (data: { width: number; height: number }) => ReactNode
}

export interface IState {
  width: number
  height: number
}

type Handler = (
  { window, screen }: { window: ScaledSize; screen: ScaledSize },
) => void

export default class DimensionsWatcher extends PureComponent<IProps, IState> {
  state: IState = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleDimensionsChange)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleDimensionsChange)
  }

  handleDimensionsChange: Handler = ({ window: { width, height } }) => {
    this.setState({ width, height })
  }

  render() {
    const { width, height } = this.state
    const { children } = this.props

    return children({ width, height })
  }
}
