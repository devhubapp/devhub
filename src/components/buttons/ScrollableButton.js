import React from 'react';
import styled from 'styled-components/native';

import ScrollableContentContainer from '../ScrollableContentContainer';
import { contentPadding } from '../../styles/variables';

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${contentPadding}px;
`;

export default class extends React.PureComponent {
  props: {
    children: React.Element,
    contentContainerStyle?: Object,
    onPress: Function,
    buttonProps?: Object,
  };

  render() {
    const {
      buttonProps,
      contentContainerStyle,
      children,
      onPress,
      ...props
    } = this.props;

    return (
      <ScrollableContentContainer
        contentContainerStyle={[
          { alignItems: 'stretch' },
          contentContainerStyle,
        ]}
        {...props}
      >
        <StyledButton onPress={onPress} {...buttonProps}>
          {children}
        </StyledButton>
      </ScrollableContentContainer>
    );
  }
}
