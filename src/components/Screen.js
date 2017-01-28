// @flow

import styled from 'styled-components/native';

export default styled.View`
  flex: 1;
  background-color: ${({ background, theme }) => background || theme.base00};
  padding-top: 22;
`;
