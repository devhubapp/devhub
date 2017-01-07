// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';

import { contentPadding, radius as defaultRadius } from '../../styles/variables';

export const columnMargin = 2;
export const columnPreviewWidth = Platform.OS === 'ios' ? contentPadding : 0; // because android does not support overflow visible
export const maxWidth = Platform.OS === 'android' ? 800 : 680;
export const getFullWidth = () => Dimensions.get('window').width;
export const getWidth = () => Math.min(getFullWidth() - (2 * columnPreviewWidth), maxWidth);
export const getRadius = (
  ({ radius } = {}) => (typeof radius === 'undefined' ? defaultRadius : radius)
);

export const ColumnWrapper = styled.View`
  flex: 1;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || getWidth()};
`;

export const ColumnRoot = styled.View`
  flex: 1;
  align-self: stretch;
  margin-horizontal: ${columnMargin}
  margin-vertical: ${columnMargin};
  background-color: ${({ theme }) => theme.base02};
  border-width: 1;
  border-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius || 0};
`;

export default class extends React.PureComponent {
  props: {
    children: React.Element,
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
      <ColumnWrapper width={width}>
        <ColumnRoot radius={_radius} {...props}>
          {children}
        </ColumnRoot>
      </ColumnWrapper>
    );
  }
}
