// @flow

import React from 'react';
import styled from 'styled-components/native';
import withOrientation from '../../hoc/withOrientation';
import { Dimensions, Platform } from 'react-native';

import { contentPadding, radius as defaultRadius } from '../../styles/variables';

export const columnMargin = contentPadding / 2;
export const columnPreviewWidth = contentPadding / 2;

export const maxWidth = Platform.OS === 'android' ? 800 : 680;
export const getFullWidth = () => Dimensions.get('window').width;
export const getWidth = () => Math.min(getFullWidth() - (2 * columnPreviewWidth), maxWidth);
export const getRadius = (
  ({ radius } = {}) => (typeof radius === 'undefined' ? defaultRadius : radius)
);

export const ColumnWrapper = styled.View`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  width: ${getFullWidth()};
`;

export const ColumnRoot = styled.View`
  flex: 1;
  align-self: center;
  width: ${({ width }) => width || getWidth()};
  margin-horizontal: ${columnMargin}
  margin-vertical: ${columnMargin};
  background-color: ${({ outline, theme }) => (outline ? 'transparent' : theme.base02)};
  border-width: 1;
  border-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
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
    const {
      children,
      radius,
      width,
      ...props
    } = this.props;

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
