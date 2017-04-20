import React from 'react';
import { withTheme } from 'styled-components/native';

import ActionSheet from '../libs/actionsheet';
import { columnMargin } from './columns/_Column';

import { radius } from '../styles/variables';

export default withTheme(({
  innerRef,
  optionContainerStyle,
  theme,
  ...props
}) => (
  <ActionSheet
    ref={innerRef}
    containerPadding={columnMargin}
    optionContainerStyle={[
      {
        backgroundColor: theme.base00,
      },
      optionContainerStyle,
    ]}
    radius={radius}
    tintColor={theme.isDark ? theme.base04 : undefined}
    titleTextStyle={{ color: theme.base05 }}
    {...props}
  />
));
