// @flow

import React from 'react';
import styled from 'styled-components/native';
import withOrientation from '../../hoc/withOrientation';
import { Dimensions, Platform } from 'react-native';

import {
  contentPadding,
  radius as defaultRadius,
} from '../../styles/variables';

export const columnMargin = contentPadding / 2;
export const columnPreviewWidth = Platform.OS === 'web'
  ? 2
  : contentPadding / 2;

export const maxWidth = Platform.select({
  default: 360,
  android: 800,
  ios: 680,
  web: 360,
});
export const getColumnWidth = () =>
  Math.min(Dimensions.get('window').width, maxWidth);
export const getColumnContentWidth = () =>
  getColumnWidth() - 2 * columnPreviewWidth;
export const getRadius = ({ radius } = {}) =>
  typeof radius === 'undefined' ? defaultRadius : radius;

export const ColumnWrapper = styled.View`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  width: ${getColumnWidth()}px;
`;

export const ColumnRoot = styled.View`
  flex: 1;
  align-self: center;
  width: ${({ width }) => width || getColumnContentWidth()}px;
  margin-horizontal: ${columnMargin}px;
  margin-vertical: ${columnMargin}px;
  background-color: ${({ outline, theme }) => (outline ? 'transparent' : theme.base02)};
  border-width: 0px;
  border-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0}px;
`;

@withOrientation
export default class extends React.PureComponent {
  props: {
    children: React.Element,
    outline?: boolean,
    radius?: number,
    width?: number,
  };

  render() {
    const { children, radius, width, ...props } = this.props;

    const _radius = getRadius({ radius });

    return (
      <ColumnWrapper>
        <ColumnRoot radius={_radius} width={width} {...props}>
          {children}
        </ColumnRoot>
      </ColumnWrapper>
    );
  }
}
