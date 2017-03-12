// @flow

import React from 'react';
import styled from 'styled-components/native';

import Browser from '../../components/Browser';
import Screen from '../../components/Screen';

const StyledBrowser = styled(Browser) `
  flex: 1;
`;

type Props = { navigation: Object };
export default ({ navigation: { state: { params: { uri, ...params } } }, ...props }: Props) => (
  <Screen>
    <StyledBrowser source={{ uri }} {...params} {...props} />
  </Screen>
);
