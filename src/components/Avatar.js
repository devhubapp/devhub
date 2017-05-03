// @flow

import React from 'react'
import styled from 'styled-components/native'
import { Platform } from 'react-native'
import type ImageSourcePropType
  from 'react-native/Libraries/Image/ImageSourcePropType'

import { radius as defaultRadius, mutedOpacity } from '../styles/variables'

const bgColorAfterLog = Platform.select({
  android: 'transparent',
  default: '#ffffff',
})

const AvatarImage = styled.Image`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ error, loading, theme }) => (!loading && !error ? bgColorAfterLog : theme.base03)};
  border-radius: ${({ radius }) => radius}px;
  opacity: ${({ muted }) => (muted ? mutedOpacity : 1)};
`

export default class Avatar extends React.PureComponent {
  static defaultProps = {
    onLoad: undefined,
    onLoadStart: undefined,
    onLoadEnd: undefined,
    onError: undefined,
    radius: defaultRadius,
    size: 50,
  }

  state = {
    error: false,
    loading: true,
  }

  onLoad = next => () => {
    this.setState({ loading: false, error: false })
    if (typeof next === 'function') next()
  }

  onLoadStart = next => () => {
    this.setState({ loading: true })
    if (typeof next === 'function') next()
  }

  onLoadEnd = next => () => {
    this.setState({ loading: false })
    if (typeof next === 'function') next()
  }

  onError = next => () => {
    this.setState({ loading: false, error: true })
    if (typeof next === 'function') next()
  }

  props: {
    onLoad?: Function,
    onLoadStart?: Function,
    onLoadEnd?: Function,
    onError?: Function,
    size?: number,
    radius?: number,
    source: ImageSourcePropType,
  }

  render() {
    const { error, loading } = this.state

    const {
      size,
      radius,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onError,
      ...props
    } = this.props

    delete props.error
    delete props.loading

    return (
      <AvatarImage
        size={size}
        radius={radius}
        error={error}
        loading={loading}
        resizeMode="cover"
        onLoad={this.onLoad(onLoad)}
        onLoadStart={this.onLoadStart(onLoadStart)}
        onLoadEnd={this.onLoadEnd(onLoadEnd)}
        onError={this.onError(onError)}
        {...props}
      />
    )
  }
}
