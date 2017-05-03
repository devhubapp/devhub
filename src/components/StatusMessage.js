// @flow

import React from 'react';

import styled from 'styled-components/native';

import { contentPadding } from '../styles/variables';

const StatusMessageWrapper = styled.View`
  background-color: ${({ error, theme }) => (error ? theme.red : theme.green)};
  padding-horizontal: ${contentPadding}px;
  padding-vertical: ${contentPadding / 3}px;
`;
const StatusMessageText = styled.Text`
  color: ${({ theme }) => theme.base02};
  font-size: 12px;
  text-align: center;
`;

export default class extends React.PureComponent {
  props: {
    error?: ?boolean,
    message: string,
  };

  render() {
    const { error, message } = this.props;

    return (
      <StatusMessageWrapper error={error}>
        <StatusMessageText error={error}>{message}</StatusMessageText>
      </StatusMessageWrapper>
    );
  }
}
