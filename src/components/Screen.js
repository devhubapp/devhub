// @flow

import styled from 'styled-components/native';
import { Platform } from 'react-native';

import { contentPadding } from '../styles/variables';

export default styled.View`
  flex: 1;
  background-color: ${({ background, theme }) => background || theme.base00};
  padding-top: ${(Platform.OS === 'ios' ? 22 : 0) + (contentPadding / 2)};
`;
