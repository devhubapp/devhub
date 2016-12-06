// @flow

import React from 'react';
import styled from 'styled-components/native';
import type ImageSourcePropType from 'react-native/Libraries/Image/ImageSourcePropType';

import { radius } from '../styles/variables';

const Avatar = styled.Image`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: ${({ error, loading, theme }) => (!loading && !error ? '#ffffff' : theme.base03)};
  border-radius: ${radius};
`;

export default class extends React.PureComponent {
  state = {
    error: false,
    loading: true,
  };

  onLoad = next => () => {
    this.setState({ loading: false, error: false });
    if (typeof next === 'function') next();
  };

  onLoadStart = next => () => {
    this.setState({ loading: true });
    if (typeof next === 'function') next();
  };

  onLoadEnd = next => () => {
    this.setState({ loading: false });
    if (typeof next === 'function') next();
  };

  onError = next => () => {
    this.setState({ loading: false, error: true });
    if (typeof next === 'function') next();
  };

  props: {
    onLoad?: Function,
    onLoadStart?: Function,
    onLoadEnd?: Function,
    onError?: Function,
    size?: number,
    source: ImageSourcePropType,
  };

  render() {
    const { error, loading } = this.state;
    const { size = 50, onLoad, onLoadStart, onLoadEnd, onError, ...props } = this.props;
    delete props.error;
    delete props.loading;

    return (
      <Avatar
        size={size}
        error={error}
        loading={loading}
        resizeMode="cover"
        onLoad={this.onLoad(onLoad)}
        onLoadStart={this.onLoadStart(onLoadStart)}
        onLoadEnd={this.onLoadEnd(onLoadEnd)}
        onError={this.onError(onError)}
        {...props}
      />
    );
  }
}
