import React from 'react'
import { Platform } from 'react-native'
import { withTheme } from 'styled-components/native'

import ActionSheet from '../libs/actionsheet'
import { columnMargin } from './columns/_Column'

import { radius } from '../styles/variables'

const StyledActionSheet = withTheme(
  ({ innerRef, optionContainerStyle, theme, ...props }) => (
    <ActionSheet
      ref={innerRef}
      containerPadding={columnMargin}
      optionContainerStyle={[
        { backgroundColor: theme.base02 },
        optionContainerStyle,
      ]}
      optionsContainerStyle={[
        { backgroundColor: theme.base01 },
        optionContainerStyle,
      ]}
      radius={radius}
      tintColor={
        !theme.isDark && Platform.OS === 'ios' ? undefined : theme.base04
      }
      titleTextStyle={{ color: theme.base05 }}
      {...props}
    />
  ),
)

StyledActionSheet.propTypes = ActionSheet.propTypes

export default StyledActionSheet
