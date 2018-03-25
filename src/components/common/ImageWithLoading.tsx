import _ from 'lodash'
import React, { PureComponent } from 'react'
import { Image, ImageProperties } from 'react-native'

export interface IProps extends ImageProperties {
  backgroundColorFailed: string
  backgroundColorLoaded: string
  backgroundColorLoading: string
  onError?: ImageProperties['onError']
  onLoad?: ImageProperties['onLoad']
  onLoadEnd?: ImageProperties['onLoadEnd']
  onLoadStart?: ImageProperties['onLoadStart']
}

export default class Avatar extends PureComponent<IProps> {
  static defaultProps = {
    onError: undefined,
    onLoad: undefined,
    onLoadEnd: undefined,
    onLoadStart: undefined,
  }

  state = {
    error: false,
    loading: true,
  }

  onLoad = _.memoize(
    (next: ImageProperties['onLoad']): ImageProperties['onLoad'] => () => {
      this.setState({ loading: false, error: false })
      if (typeof next === 'function') next()
    },
  )

  onLoadStart = _.memoize(
    (
      next: ImageProperties['onLoadStart'],
    ): ImageProperties['onLoadStart'] => () => {
      this.setState({ loading: true })
      if (typeof next === 'function') next()
    },
  )

  onLoadEnd = _.memoize(
    (
      next: ImageProperties['onLoadEnd'],
    ): ImageProperties['onLoadEnd'] => () => {
      this.setState({ loading: false })
      if (typeof next === 'function') next()
    },
  )

  onError = _.memoize(
    (next: ImageProperties['onError']): ImageProperties['onError'] => error => {
      this.setState({ loading: false, error: true })
      if (typeof next === 'function') next(error)
    },
  )

  render() {
    const { error, loading } = this.state
    const {
      backgroundColorFailed,
      backgroundColorLoaded,
      backgroundColorLoading,
      onError,
      onLoad,
      onLoadEnd,
      onLoadStart,
      style,
      ...props
    } = this.props

    return (
      <Image
        {...props}
        onError={this.onError(onError)}
        onLoad={this.onLoad(onLoad)}
        onLoadEnd={this.onLoadEnd(onLoadEnd)}
        onLoadStart={this.onLoadStart(onLoadStart)}
        style={[
          style,
          {
            backgroundColor: error
              ? backgroundColorFailed
              : loading ? backgroundColorLoading : backgroundColorLoaded,
          },
        ]}
      />
    )
  }
}
