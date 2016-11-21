// @flow

import React from 'react';
import styled from 'styled-components/native';

import Columns from './Columns';

const Main = styled.View`
  flex: 1;
`;

export default () => (
  <Main>
    <Columns />
  </Main>
);
